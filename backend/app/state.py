from pathlib import Path
from app.retrieval.vector_store import InMemoryVectorStore
from app.retrieval.corpus import load_corpus
from app.pipelines.orchestrator import SentinelOrchestrator


vector_store = InMemoryVectorStore()
dataset_file = Path(__file__).resolve().parent.parent / "datasets" / "support_corpus.json"
if dataset_file.exists():
    load_corpus(dataset_file, vector_store)

orchestrator = SentinelOrchestrator(vector_store)
