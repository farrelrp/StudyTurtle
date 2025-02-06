"use client";

import FlashcardSelection from "@/components/FlashcardSelection";
import React from "react";
import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function FlashcardsPage() {
  const [user] = useAuthState(auth);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const response = await fetch(
          `/api/flashcards/get_cards?userId=${user?.uid}`
        );
        const result = await response.json();
        console.log("Flashcards result:", result);
        setData(result.flashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (!user || loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-5 px-5 py-5">
        <div className="flex flex-col gap-2 max-w-fit">
          <h1 className="text-3xl text-white font-extrabold">
            Flashcards Page
          </h1>
          <p className="text-xl text-white">
            This is the flashcards page. You can study your flashcards here.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full px-5 py-5 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((flashcard) => (
            <FlashcardSelection
              key={flashcard.id}
              id={flashcard.id}
              pdfId={flashcard.pdfId} // PDF Source
              flashcardSetTitle={flashcard.flashcards.flashcardSetTitle}
              flashcardSetDescription={
                flashcard.flashcards.flashcardSetDescription
              }
              flashcardSetQuestionCount={
                flashcard.flashcards.flashcardSetQuestionCount
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
