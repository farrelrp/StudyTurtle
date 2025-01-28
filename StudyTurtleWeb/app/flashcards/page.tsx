import FlashcardSelection from "@/components/FlashcardSelection";
import React from "react";

// Server Action to Fetch Data
async function getFlashcards() {
  "use server"; // Server action
  return Array.from({ length: 10 }, (_, index) => ({
    id: `728ed52f-${index}`,
    question_count: 10,
    source: `Slide ${index}.pdf`,
    title: `Flashcard Set ${index}`,
    description: `This is a description of the flashcard set talking about flashcards and how they are useful for studying.`,
  }));
}

// Flashcards Page Component
export default async function FlashcardsPage() {
  const data = await getFlashcards(); // Fetch data on the server

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
        <div className="grid grid-cols-1 gap- md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((flashcard) => (
            <FlashcardSelection key={flashcard.id} {...flashcard} />
          ))}
        </div>
      </div>
    </>
  );
}
