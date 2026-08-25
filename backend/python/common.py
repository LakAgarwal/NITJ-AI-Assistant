# import json
# import os
# import sys
# import time
# from pathlib import Path

# import requests
# from dotenv import load_dotenv

# load_dotenv()

# HF_API_KEY = os.getenv("HF_API_KEY", "")
# EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
# LLM_MODEL = os.getenv("LLM_MODEL", "mistralai/Mistral-7B-Instruct-v0.2")
# CHROMA_PATH = os.getenv("CHROMA_PATH", "../../chroma_db")
# COLLECTION_NAME = "college_documents"


# def fail(message, status=1):
#     print(json.dumps({"success": False, "message": message}))
#     sys.exit(status)


# def chroma_path():
#     path = Path(CHROMA_PATH)
#     if not path.is_absolute():
#         path = Path(__file__).resolve().parent / path
#     path.mkdir(parents=True, exist_ok=True)
#     return str(path.resolve())


# def headers():
#     if not HF_API_KEY:
#         fail("HF_API_KEY is not configured")
#     return {"Authorization": f"Bearer {HF_API_KEY}"}


# def normalize_embedding_response(payload):
#     if not isinstance(payload, list):
#         fail(f"Unexpected embedding response: {payload}")

#     if payload and isinstance(payload[0], dict) and payload[0].get("error"):
#         fail(payload[0]["error"])

#     if payload and isinstance(payload[0], list):
#         if payload[0] and isinstance(payload[0][0], list):
#             return [item[0] if item and isinstance(item[0], list) else item for item in payload]
#         return payload

#     fail(f"Unexpected embedding response: {payload}")


# def get_embeddings(texts):
#     response = requests.post(
#         f"https://api-inference.huggingface.co/pipeline/feature-extraction/{EMBED_MODEL}",
#         headers=headers(),
#         json={"inputs": texts},
#         timeout=120,
#     )

#     if response.status_code == 503:
#         time.sleep(15)
#         response = requests.post(
#             f"https://api-inference.huggingface.co/pipeline/feature-extraction/{EMBED_MODEL}",
#             headers=headers(),
#             json={"inputs": texts},
#             timeout=120,
#         )

#     if response.status_code >= 400:
#         fail(f"Hugging Face embedding error {response.status_code}: {response.text}")

#     return normalize_embedding_response(response.json())


# def get_collection():
#     import chromadb

#     client = chromadb.PersistentClient(path=chroma_path())
#     return client.get_or_create_collection(name=COLLECTION_NAME)


import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "llama3-8b-8192")
CHROMA_PATH = os.getenv("CHROMA_PATH", "../../chroma_db")
COLLECTION_NAME = "college_documents"

_embedder = None


def fail(message, status=1):
    print(json.dumps({"success": False, "message": message}))
    sys.exit(status)


def chroma_path():
    path = Path(CHROMA_PATH)
    if not path.is_absolute():
        path = Path(__file__).resolve().parent / path
    path.mkdir(parents=True, exist_ok=True)
    return str(path.resolve())


def get_embedder():
    global _embedder
    if _embedder is None:
        from sentence_transformers import SentenceTransformer
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedder


def get_embeddings(texts):
    embedder = get_embedder()
    vectors = embedder.encode(texts, convert_to_numpy=True)
    return vectors.tolist()


def get_llm_answer(prompt):
    if not GROQ_API_KEY:
        fail("GROQ_API_KEY is not configured in python/.env")

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": LLM_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 400,
            "temperature": 0.2,
        },
        timeout=60,
    )

    if response.status_code >= 400:
        fail(f"Groq API error {response.status_code}: {response.text}")

    return response.json()["choices"][0]["message"]["content"].strip()


def get_collection():
    import chromadb
    client = chromadb.PersistentClient(path=chroma_path())
    return client.get_or_create_collection(name=COLLECTION_NAME)