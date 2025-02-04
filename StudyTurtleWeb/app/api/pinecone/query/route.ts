import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbedding } from "@/lib/embeddings";

// init pinecone
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pc.index("studyturtle");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pdfId, numQuestions, additionalRequest } = body;

    // get the embedding for the search query
    const queryEmbedding = await getEmbedding(additionalRequest);
    console.log("queryEmbedding", queryEmbedding);

    // hit up pinecone with our search
    const queryResponse = await index.namespace(pdfId).query({
      vector: queryEmbedding,
      topK: 40,
      includeMetadata: true,
    });

    // extract the contexts from the matches
    const contexts = queryResponse.matches.map((match) => ({
      text: match.metadata?.text || "",
      score: match.score,
    }));

    return NextResponse.json({
      success: true,
      contexts,
    });
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    return NextResponse.json(
      { success: false, error: "Failed to query Pinecone" },
      { status: 500 }
    );
  }
}
