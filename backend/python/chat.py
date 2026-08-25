# import json
# import sys
# import time

# import requests

# from common import LLM_MODEL, fail, get_collection, get_embeddings, headers


# NOT_FOUND = "I couldn't find this information in the uploaded documents."


# def delete_vectors(filename):
#     collection = get_collection()
#     results = collection.get(where={"filename": filename})
#     ids = results.get("ids", [])
#     if ids:
#         collection.delete(ids=ids)
#     print(json.dumps({"success": True, "deleted": len(ids)}))


# def build_prompt(question, documents, metadatas):
#     context_lines = []
#     for text, metadata in zip(documents, metadatas):
#         context_lines.append(
#             f"{text}\n[Source: {metadata.get('document_title')}, Page {metadata.get('page_number')}]"
#         )

#     context = "\n\n".join(context_lines)
#     return f"""You are a helpful AI assistant for NIT Jalandhar college.
# Answer the question using ONLY the context below.
# If the answer is not found in the context, say exactly:
# "{NOT_FOUND}"
# Do not make up or guess any information.

# Context:
# {context}

# Question: {question}
# Answer:"""


# def call_llm(prompt):
#     payload = {
#         "inputs": prompt,
#         "parameters": {
#             "max_new_tokens": 400,
#             "temperature": 0.2,
#             "return_full_text": False,
#         },
#     }

#     response = requests.post(
#         f"https://api-inference.huggingface.co/models/{LLM_MODEL}",
#         headers=headers(),
#         json=payload,
#         timeout=180,
#     )

#     if response.status_code == 503:
#         time.sleep(15)
#         response = requests.post(
#             f"https://api-inference.huggingface.co/models/{LLM_MODEL}",
#             headers=headers(),
#             json=payload,
#             timeout=180,
#         )

#     if response.status_code >= 400:
#         fail(f"Hugging Face LLM error {response.status_code}: {response.text}")

#     data = response.json()
#     if isinstance(data, list) and data:
#         return data[0].get("generated_text", "").strip()
#     if isinstance(data, dict):
#         return data.get("generated_text", data.get("error", "")).strip()
#     return str(data).strip()


# def unique_sources(documents, metadatas):
#     seen = set()
#     sources = []

#     for text, metadata in zip(documents, metadatas):
#         key = (metadata.get("filename"), metadata.get("page_number"))
#         if key in seen:
#             continue
#         seen.add(key)
#         sources.append({
#             "documentTitle": metadata.get("document_title"),
#             "filename": metadata.get("filename"),
#             "pageNumber": metadata.get("page_number"),
#             "chunkText": text[:200],
#         })

#     return sources


# def answer_question(question):
#     question_vector = get_embeddings([question])[0]
#     collection = get_collection()
#     results = collection.query(query_embeddings=[question_vector], n_results=5)

#     documents = results.get("documents", [[]])[0]
#     metadatas = results.get("metadatas", [[]])[0]

#     if not documents:
#         print(json.dumps({"answer": NOT_FOUND, "sources": []}))
#         return

#     prompt = build_prompt(question, documents, metadatas)
#     answer = call_llm(prompt) or NOT_FOUND
#     sources = unique_sources(documents, metadatas)
#     print(json.dumps({"answer": answer, "sources": sources}))


# def main():
#     if len(sys.argv) >= 3 and sys.argv[1] == "--delete":
#         delete_vectors(sys.argv[2])
#         return

#     if len(sys.argv) < 2:
#         fail("Usage: chat.py <question> <userId>")

#     answer_question(sys.argv[1].strip())


# if __name__ == "__main__":
#     main()



import json
import sys
import time

import requests

from common import fail, get_collection, get_embeddings, get_llm_answer


NOT_FOUND = "I couldn't find this information in the uploaded documents."


def delete_vectors(filename):
    collection = get_collection()
    results = collection.get(where={"filename": filename})
    ids = results.get("ids", [])
    if ids:
        collection.delete(ids=ids)
    print(json.dumps({"success": True, "deleted": len(ids)}))


def build_prompt(question, documents, metadatas):
    context_lines = []
    for text, metadata in zip(documents, metadatas):
        context_lines.append(
            f"{text}\n[Source: {metadata.get('document_title')}, Page {metadata.get('page_number')}]"
        )

    context = "\n\n".join(context_lines)
    return f"""You are a helpful AI assistant for NIT Jalandhar college.
Answer the question using ONLY the context below.
If the answer is not found in the context, say exactly:
"{NOT_FOUND}"
Do not make up or guess any information.

Context:
{context}

Question: {question}
Answer:"""


def unique_sources(documents, metadatas):
    seen = set()
    sources = []

    for text, metadata in zip(documents, metadatas):
        key = (metadata.get("filename"), metadata.get("page_number"))
        if key in seen:
            continue
        seen.add(key)
        sources.append({
            "documentTitle": metadata.get("document_title"),
            "filename": metadata.get("filename"),
            "pageNumber": metadata.get("page_number"),
            "chunkText": text[:200],
        })

    return sources


def answer_question(question):
    question_vector = get_embeddings([question])[0]
    collection = get_collection()
    results = collection.query(query_embeddings=[question_vector], n_results=5)

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    if not documents:
        print(json.dumps({"answer": NOT_FOUND, "sources": []}))
        return

    prompt = build_prompt(question, documents, metadatas)
    answer = get_llm_answer(prompt) or NOT_FOUND
    sources = unique_sources(documents, metadatas)
    print(json.dumps({"answer": answer, "sources": sources}))


def main():
    if len(sys.argv) >= 3 and sys.argv[1] == "--delete":
        delete_vectors(sys.argv[2])
        return

    if len(sys.argv) < 2:
        fail("Usage: chat.py <question> <userId>")

    answer_question(sys.argv[1].strip())


if __name__ == "__main__":
    main()