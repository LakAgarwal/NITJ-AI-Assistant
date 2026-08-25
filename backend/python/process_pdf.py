import json
import os
import sys
import time
from pathlib import Path

import fitz
from docx import Document as DocxDocument
from langchain_text_splitters import RecursiveCharacterTextSplitter

from common import fail, get_collection, get_embeddings


def parse_pdf(filepath):
    pages = []
    with fitz.open(filepath) as pdf:
        for index, page in enumerate(pdf, start=1):
            text = page.get_text("text").strip()
            if text:
                pages.append({"text": text, "page_number": index})
        return pages, pdf.page_count


def parse_txt(filepath):
    text = Path(filepath).read_text(encoding="utf-8", errors="ignore").strip()
    return ([{"text": text, "page_number": 1}] if text else []), 1


def parse_docx(filepath):
    doc = DocxDocument(filepath)
    text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    return ([{"text": text, "page_number": 1}] if text else []), 1


def parse_document(filepath):
    ext = Path(filepath).suffix.lower()
    if ext == ".pdf":
        return parse_pdf(filepath)
    if ext == ".txt":
        return parse_txt(filepath)
    if ext == ".docx":
        return parse_docx(filepath)
    fail("Unsupported file type")


def chunk_pages(pages, title, filename):
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = []

    for page in pages:
        for chunk in splitter.split_text(page["text"]):
            cleaned = chunk.strip()
            if cleaned:
                chunks.append({
                    "text": cleaned,
                    "metadata": {
                        "document_title": title,
                        "filename": filename,
                        "page_number": page["page_number"],
                    }
                })

    return chunks


def main():
    if len(sys.argv) < 3:
        fail("Usage: process_pdf.py <filepath> <document_title>")

    filepath = Path(sys.argv[1]).resolve()
    title = sys.argv[2].strip()

    if not filepath.exists():
        fail(f"File not found: {filepath}")
    if not title:
        fail("Document title is required")

    pages, page_count = parse_document(filepath)
    chunks = chunk_pages(pages, title, filepath.name)

    if not chunks:
        fail("No readable text was found in this document")

    all_embeddings = []
    for start in range(0, len(chunks), 16):
        batch = chunks[start:start + 16]
        all_embeddings.extend(get_embeddings([item["text"] for item in batch]))
        if start + 16 < len(chunks):
            time.sleep(2)

    collection = get_collection()
    ids = [f"{filepath.name}_{index}" for index in range(len(chunks))]

    collection.add(
        ids=ids,
        embeddings=all_embeddings,
        documents=[item["text"] for item in chunks],
        metadatas=[item["metadata"] for item in chunks],
    )

    print(json.dumps({"success": True, "chunks": len(chunks), "pages": page_count}))


if __name__ == "__main__":
    main()
