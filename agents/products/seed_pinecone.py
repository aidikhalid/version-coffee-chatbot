"""
Seed Pinecone index with product data, about us info, and menu items.

Usage:
    python products/seed_pinecone.py

Requires env vars: PINECONE_API_KEY, PINECONE_INDEX_NAME, PINECONE_NAMESPACE, EMBEDDING_MODEL, OPENAI_API_KEY
"""

import os
import json
import dotenv
from pinecone import Pinecone
from langchain_openai import OpenAIEmbeddings

dotenv.load_dotenv()

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = os.getenv("PINECONE_INDEX_NAME")
namespace = os.getenv("PINECONE_NAMESPACE", "ns1")
embeddings = OpenAIEmbeddings(model=os.getenv("EMBEDDING_MODEL"))

index = pc.Index(index_name)


def load_product_chunks():
    """Load products.jsonl and create one text chunk per product."""
    chunks = []
    path = os.path.join(SCRIPT_DIR, "products.jsonl")
    with open(path, "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            product = json.loads(line)
            text = (
                f"{product['name']} - {product['category']}: "
                f"{product['description']} "
                f"Ingredients: {', '.join(product['ingredients'])}. "
                f"Price: ${product['price']:.2f}. Rating: {product['rating']}."
            )
            chunks.append({
                "id": f"product-{product['name'].lower().replace(' ', '-')}",
                "text": text,
                "source": "products",
            })
    return chunks


def load_about_us_chunks():
    """Load about us text and split by section (---) into chunks."""
    chunks = []
    path = os.path.join(SCRIPT_DIR, "version_coffee_about_us.txt")
    with open(path, "r") as f:
        content = f.read()

    sections = content.split("---")
    for i, section in enumerate(sections):
        section = section.strip()
        if not section:
            continue
        chunks.append({
            "id": f"about-us-section-{i}",
            "text": section,
            "source": "about_us",
        })
    return chunks


def load_menu_items_chunk():
    """Load menu items text as a single chunk."""
    path = os.path.join(SCRIPT_DIR, "menu_items_text.txt")
    with open(path, "r") as f:
        content = f.read().strip()

    return [{
        "id": "menu-items",
        "text": content,
        "source": "menu_items",
    }]


def main():
    # Collect all chunks
    all_chunks = []
    all_chunks.extend(load_product_chunks())
    all_chunks.extend(load_about_us_chunks())
    all_chunks.extend(load_menu_items_chunk())

    print(f"Total chunks to upsert: {len(all_chunks)}")

    # Delete existing vectors in the namespace
    print(f"Deleting all vectors in namespace '{namespace}'...")
    index.delete(delete_all=True, namespace=namespace)
    print("Deleted.")

    # Generate embeddings
    texts = [chunk["text"] for chunk in all_chunks]
    print("Generating embeddings...")
    vectors = embeddings.embed_documents(texts)
    print(f"Generated {len(vectors)} embeddings.")

    # Upsert in batches of 100
    batch_size = 100
    for i in range(0, len(all_chunks), batch_size):
        batch = all_chunks[i:i + batch_size]
        batch_vectors = vectors[i:i + batch_size]
        upsert_data = [
            (
                chunk["id"],
                vec,
                {"text": chunk["text"], "source": chunk["source"]},
            )
            for chunk, vec in zip(batch, batch_vectors)
        ]
        index.upsert(vectors=upsert_data, namespace=namespace)
        print(f"Upserted batch {i // batch_size + 1} ({len(batch)} vectors)")

    print(f"Done! {len(all_chunks)} vectors upserted to index '{index_name}' namespace '{namespace}'.")


if __name__ == "__main__":
    main()
