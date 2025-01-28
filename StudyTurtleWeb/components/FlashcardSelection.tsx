import Link from "next/link";
import React from "react";

type FlashcardSelectionProps = {
  id: string;
  question_count: number;
  source: string;
  title: string;
  description: string;
};

const FlashcardSelection = ({
  id,
  question_count,
  source,
  title,
  description,
}: FlashcardSelectionProps) => {
  return (
    <Link
      href={`/flashcards/${id}`}
      className="max-w-64 flex flex-col gap-4 justify-center items-center text-center bg-white shadow-md rounded-lg p-6 text-gray-800"
    >
      <h2 className="font-bold text-2xl">{title}</h2>
      <p className="text-m text-gray-500">{description}</p>
      <p className="text-m text-gray-500 font-bold">
        {source} | {question_count} Questions
      </p>
    </Link>
  );
};

export default FlashcardSelection;
