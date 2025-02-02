import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbedding(text: string) {
  // clean the text - remove extra whitespace
  const cleanText = text.replace(/\s+/g, " ").trim();

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: cleanText,
  });

  // grab the embedding from the response
  const embedding = response.data[0].embedding;
  return embedding;
}
