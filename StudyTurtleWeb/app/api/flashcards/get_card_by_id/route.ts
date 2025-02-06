import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flashcardId = searchParams.get("flashcardId");

    if (!flashcardId) {
      return NextResponse.json(
        { error: "Flashcard ID is required" },
        { status: 400 }
      );
    }

    const flashcardDocRef = doc(db, "flashcards", flashcardId);
    const flashcardSnapshot = await getDoc(flashcardDocRef);

    if (!flashcardSnapshot.exists()) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ flashcard: flashcardSnapshot.data() });
  } catch (error) {
    console.error("Error fetching flashcard:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcard" },
      { status: 500 }
    );
  }
}
