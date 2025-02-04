import Link from "next/link";
import React from "react";

type FlashcardSelectionProps = {
  id: string;
  pdfId: string; // Source PDF
  flashcardSetTitle: string;
  flashcardSetDescription: string;
  flashcardSetQuestionCount: number;
};

const FlashcardSelection = ({
  id,
  pdfId,
  flashcardSetTitle,
  flashcardSetDescription,
  flashcardSetQuestionCount,
}: FlashcardSelectionProps) => {
  return (
    <Link
      href={`/flashcards/${id}`}
      className="max-w-64 flex flex-col gap-4 justify-center items-center text-center bg-white shadow-md rounded-lg p-6 text-gray-800 hover:shadow-lg transition"
    >
      <h2 className="font-bold text-2xl">{flashcardSetTitle}</h2>
      <p className="text-m text-gray-500">{flashcardSetDescription}</p>
      <p className="text-m text-gray-500 font-bold">
        PDF: {pdfId} | {flashcardSetQuestionCount} Questions
      </p>
    </Link>
  );
};

export default FlashcardSelection;
