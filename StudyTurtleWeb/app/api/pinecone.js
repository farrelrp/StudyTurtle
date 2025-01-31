import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY, // access securely from server side
});
const index = pc.index("studyturtle");

export default async function handler(req, res) {
  try {
    console.log(process.env.PINECONE_API_KEY);
    const { namespace } = req.query;
    const { namespaces } = await index.describeIndexStats1();
    const exists = namespaces.hasOwnProperty(namespace);
    res.status(200).json({ exists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
