import Link from "next/link";
import { title } from "process";
import React from "react";

const Flashcard = () => {
  const data = {
    id: "728ed52f-0",
    question_count: 10,
    source: "Slide A.pdf",
    title: "Flashcard Trivia",
    description:
      "This is a description of the flashcard set talking about flashcards and how they are useful for studying.",
  };
  return (
    <Link
      href="/flashcards/[id]"
      className="max-w-64 flex flex-col gap-4 justify-center items-center text-center bg-white shadow-md rounded-lg p-6 text-gray-800"
    >
      <h2 className="font-bold text-2xl">{data.title}</h2>
      <p className="text-m text-gray-500">{data.description}</p>
      <p className="text-m text-gray-500 font-bold">
        {data.source} | {data.question_count} Questions
      </p>
    </Link>
  );
};

export default Flashcard;
