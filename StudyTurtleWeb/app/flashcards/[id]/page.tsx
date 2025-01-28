import React from "react";
import Flashcard from "@/components/Flashcard";

async function getMetadata() {
  "use server";
  return {
    title: "Flashcard Set 1",
    description:
      "This is a description of the flashcard set talking about flashcards and how they are useful for studying.",
  };
}

async function getFlashcardsQuestions() {
  "use server";
  return [
    {
      question: "What is the capital of France?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Paris",
    },
    {
      question: "What is the capital of Germany?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Berlin",
    },
    {
      question: "What is the capital of Spain?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Madrid",
    },
    {
      question: "What is the capital of England?",
      answers: ["Max three words.", "London", "Berlin", "Madrid"],
      correct: "London",
    },
    {
      question: "What is the capital of England?",
      answers: ["Max three words.", "London", "Berlin", "Madrid"],
      correct: "London",
    },
    {
      question: "What is the capital of France?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Paris",
    },
    {
      question: "What is the capital of Germany?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Berlin",
    },
    {
      question: "What is the capital of Spain?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Madrid",
    },
    {
      question: "What is the capital of England?",
      answers: ["Max three words.", "London", "Berlin", "Madrid"],
      correct: "London",
    },
    {
      question: "What is the capital of England?",
      answers: ["Max three words.", "London", "Berlin", "Madrid"],
      correct: "London",
    },
    {
      question: "What is the capital of France?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Paris",
    },
    {
      question: "What is the capital of Germany?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Berlin",
    },
    {
      question: "What is the capital of Spain?",
      answers: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Madrid",
    },
    {
      question: "What is the capital of England?",
      answers: ["Max three words.", "London", "Berlin", "Madrid"],
      correct: "London",
    },
    {
      question: "What is the capital of England?",
      answers: ["Max three words.", "London", "Berlin", "Madrid"],
      correct: "London",
    },
  ];
}

async function FlashcardGame() {
  const { title, description } = await getMetadata();
  const flashcards = await getFlashcardsQuestions();
  return (
    <>
      <div className="flex justify-start items-start w-full px-5 py-5 flex-col gap-2 max-w-fit">
        <h1 className="text-3xl text-white font-extrabold">{title}</h1>
        <p className="text-xl text-white">{description}</p>
      </div>
      <div className="flex justify-center items-center w-full px-5 py-5 gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flashcards.map((flashcard, index) => (
            <Flashcard key={index} {...flashcard} />
          ))}
        </div>
      </div>
    </>
  );
}

export default FlashcardGame;
