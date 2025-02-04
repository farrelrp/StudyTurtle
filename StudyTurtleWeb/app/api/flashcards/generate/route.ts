import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/utils/firebase";
import { collection, addDoc, doc } from "firebase/firestore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a helpful AI designed to generate multiple-choice flashcards based on retrieved context from a given document. 
The flashcards must be accurate, concise, and well-structured for effective learning.
Make sure all questions are directly based on the provided context and avoid hallucinating information.
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

    const userPrompt = `
You will generate multiple-choice flashcards based on the provided context. Follow these guidelines:

- Ensure each question is directly derived from the context.
- Provide **four answer choices**, with only one correct.
- Keep answers **short and concise (max 2 sentences).**
- Format the response strictly in JSON format.

### **Context**:
${combinedContext}

### **Instructions**:
- Number of Questions: ${numQuestions}
- Additional Request: ${additionalRequest}

### **Expected JSON Output Format**:
{
  "flashcardSetTitle": "A short, relevant title",
  "flashcardSetDescription": "Brief summary of what this flashcard set covers",
  "flashcardSetQuestionCount": ${numQuestions},
  "flashcardQuestions": [
    {
      "question": "QUESTION TEXT",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": "Correct Option"
    }
  ]
}
`;

    // Generate flashcards using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
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
