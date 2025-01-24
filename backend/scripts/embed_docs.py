import os
import openai
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from langchain_openai import OpenAIEmbeddings
from db_populate import store_embeddings_in_pinecone
from dotenv import load_dotenv
load_dotenv()


OPENAI_KEY = os.getenv("OPENAI_API_KEY")

openai.api_key = OPENAI_KEY

DOC_PATH = 'backend/docs'

def main():
    # Load documents, split them, and get embeddings
    text = load_docs()
    text_chunks, metadata_list = split_documents(text)
    embeddings = embed_text(text_chunks)
    store_embeddings_in_pinecone(embeddings, metadata_list)

# Load pdf documents in the docs folder
def load_docs():
    loader = PyPDFDirectoryLoader(DOC_PATH)
    return loader.load()


def split_documents(documents: list[Document]):
    # Split the documents into chunks for embedding
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(documents)

    metadata_list = []
    for i, chunk in enumerate(chunks):
        source = chunk.metadata.get("source", "unknown")
        namespace = os.path.splitext(os.path.basename(source))[0]
        print(f"Processing chunk {i} for document {namespace} in {source}...")
        metadata_list.append({
            "source": source, 
            "chunk": i, 
            "text": chunk.page_content,
            "namespace": namespace
        })

    return chunks, metadata_list

def embed_text(text_chunks):
    embeddings = OpenAIEmbeddings()
    return [embeddings.embed_documents([chunk.page_content])[0] for chunk in text_chunks]


if __name__ == "__main__":
    main()
