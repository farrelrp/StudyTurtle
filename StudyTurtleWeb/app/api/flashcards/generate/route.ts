import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/utils/firebase";
import { collection, addDoc, doc } from "firebase/firestore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// placeholder prompt - replace with your actual prompt
const FLASHCARD_PROMPT = `
Given the following context, create {numQuestions} flashcards in JSON format.
Additional request: {additionalRequest}
Context: {context}

Return only a JSON array of flashcards with this format:
[
  {
    "front": "question here",
    "back": "answer here"
  }
]
`;

export async function POST(req: Request) {
  try {
    const { userId, pdfId, numQuestions, additionalRequest } = await req.json();

    // First, get contexts from our query endpoint
    const queryResponse = await fetch(
      `${req.headers.get("origin")}/api/pinecone/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfId,
          numQuestions,
          additionalRequest,
        }),
      }
    );

    const queryData = await queryResponse.json();
    if (!queryData.success) {
      throw new Error("Failed to get contexts from Pinecone");
    }

    // Combine all contexts into one string, sorted by score
    const combinedContext = queryData.contexts
      .sort((a: any, b: any) => b.score - a.score)
      .map((c: any) => c.text)
      .join("\n\n");

    // Replace placeholders in prompt
    const prompt = FLASHCARD_PROMPT.replace(
      "{numQuestions}",
      String(numQuestions)
    )
      .replace("{additionalRequest}", additionalRequest)
      .replace("{context}", combinedContext);

    // Generate flashcards using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates flashcards based on provided context. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const flashcardsJson = JSON.parse(completion.choices[0].message.content);

    // Store in Firestore
    const flashcardsRef = collection(
      db,
      "users",
      userId,
      "pdfs",
      pdfId,
      "flashcards"
    );
    const docRef = await addDoc(flashcardsRef, {
      flashcards: flashcardsJson,
      createdAt: new Date().toISOString(),
      numQuestions,
      additionalRequest,
    });

    return NextResponse.json({
      success: true,
      flashcardId: docRef.id,
      flashcards: flashcardsJson,
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate flashcards",
      },
      { status: 500 }
    );
  }
}
