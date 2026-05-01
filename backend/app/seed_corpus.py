from pathlib import Path
from app.retrieval.vector_store import InMemoryVectorStore
from app.retrieval.corpus import load_corpus


def main():
    dataset = Path(__file__).resolve().parent.parent / "datasets" / "support_corpus.json"
    store = InMemoryVectorStore()
    inserted = load_corpus(dataset, store)
    print(f"Indexed chunks: {inserted}")


if __name__ == "__main__":
    main()
