import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/utils/firebase";
import { collection, addDoc, doc } from "firebase/firestore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FLASHCARD_PROMPT = `
"You are a helpful AI that generates multiple-choice flashcards based on a given context. I will provide you with a {context}, which contains relevant information, and a {numOfQuestions}, which specifies the number of flashcards needed.

Generate a JSON object with the following structure:
{
  "flashcardSetTitle": "A concise title summarizing the topic",
  "flashcardSetDescription": "A brief overview of what the flashcard set covers",
  "flashcardSetQuestionCount": {numQuestions},
  "flashcardQuestions": [
    {
      "question": "QUESTION HERE",
      "options": [
        "Max 2 sentence answer",
        "Max 2 sentence answer",
        "Max 2 sentence answer",
        "Max 2 sentence answer"
      ],
      "correct": "Max 2 sentence answer"
    }
  ]
}

Ensure that:
Each question is relevant to the {context}.
The four multiple-choice options are plausible answers, with only one correct. Each answer should be short, max 2 sentences.
The answers must be SHORT and CONCISE, MAX 2 SENTENCES.
The correct answer is included in the "correct" field.
The responses are clear, concise, and informative.

Now, generate the flashcard JSON output based on the provided {context} and {numQuestions}. While making the questions make sure to 
follow these instructions {additionalRequest}"
`;

export async function POST(req: Request) {
  try {
    const { userId, pdfId, numQuestions, additionalRequest } = await req.json();

    // First, get contexts from our query endpoint
    const queryResponse = await fetch(
      "http://localhost:3000/api/pinecone/query",
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
      .replace("{context}", combinedContext)
      .replace("{additionalRequest}", additionalRequest);

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
