import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const pdfsCollectionRef = collection(db, "users", userId, "pdfs");
    const pdfsSnapshot = await getDocs(pdfsCollectionRef);

    // Fetch all flashcards in parallel
    const flashcardsPromises = pdfsSnapshot.docs.map(async (pdfDoc) => {
      const flashcardsCollectionRef = collection(
        db,
        "users",
        userId,
        "pdfs",
        pdfDoc.id,
        "flashcards"
      );
      const flashcardsSnapshot = await getDocs(flashcardsCollectionRef);

      return flashcardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        pdfId: pdfDoc.id,
        ...doc.data(),
      }));
    });

    const flashcardsArray = await Promise.all(flashcardsPromises);
    return NextResponse.json({ flashcards: flashcardsArray.flat() });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}
