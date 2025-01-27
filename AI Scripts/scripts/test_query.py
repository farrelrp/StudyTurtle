import os
from pinecone import Pinecone
from langchain_openai import OpenAIEmbeddings
import openai
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(
    api_key=os.environ.get("PINECONE_API_KEY")
)

openai.api_key = os.getenv("OPENAI_API_KEY")
index = pc.Index("studyturtle")


def query_pinecone(query_text):
    query_embedding = OpenAIEmbeddings().embed_documents([query_text])[0]
    print(f"Query Embedding: {query_embedding}")  # Debugging line
    
    # Correct the query by passing arguments as keyword arguments
    results = index.query(vector=query_embedding, top_k=5, namespace='backend\docs\monopoly.pdf')  # Pass 'vector' and 'top_k' as keyword arguments
    
    # Print the retrieved text and score
    for result in results['matches']:
        chunk_id = result['id']
        score = result['score']
        
        # Check if 'metadata' exists, and then get the 'text'
        metadata = result.get('metadata', {})
        text = metadata.get('text', 'Text not found')
        
        print(f"Chunk ID: {chunk_id}, Similarity Score: {score}, Text: {text}")


if __name__ == "__main__":
    query_pinecone("What is monopoly?")