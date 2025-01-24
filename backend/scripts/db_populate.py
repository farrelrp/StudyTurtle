import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(
    api_key=os.environ.get("PINECONE_API_KEY")
)

# Now do stuff
if 'studyturtle' not in pc.list_indexes().names():
    pc.create_index(
        name='studyturtle',
        dimension=1536,
        metric='euclidean',
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        )
    )

index = pc.Index("studyturtle")

def store_embeddings_in_pinecone(embeddings, metadata_list):
    # Loop through embeddings
    for i, (embedding, metadata) in enumerate(zip(embeddings, metadata_list)):
        chunk_id = f"chunk-{metadata['chunk']}"
        namespace = metadata['namespace']
        
        index.upsert([(chunk_id, embedding, metadata)], namespace=namespace)

