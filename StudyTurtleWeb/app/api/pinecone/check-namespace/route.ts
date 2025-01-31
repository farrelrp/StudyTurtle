// app/api/pinecone/route.ts
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});
const index = pc.index("studyturtle");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const namespace = searchParams.get("namespace"); // Get the namespace from query string

    if (!namespace) {
      return new Response(JSON.stringify({ error: "Namespace is required" }), {
        status: 400,
      });
    }

    const { namespaces } = await index.describeIndexStats();
    const exists = namespaces.hasOwnProperty(namespace);

    return new Response(JSON.stringify({ exists }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
