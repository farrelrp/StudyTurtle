"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Flashcard from "@/components/Flashcard";

async function getFlashcards(id: string) {
  const response = await fetch(
    `/api/flashcards/get_card_by_id/?flashcardId=${id}`
  );
  const data = await response.json();
  console.log("Flashcards data:", data);
  console.log(data.flashcard.flashcards.flashcardSetQuestionCount);
  return data.flashcard.flashcards;
}

function FlashcardGame() {
  const { id } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      getFlashcards(id as string).then((data) => {
        setFlashcards(data.flashcardQuestions);
        setTitle(data.flashcardSetTitle);
        setDescription(data.flashcardSetDescription);
      });
    }
  }, [id]);

  if (!id) {
    return <div>Loading...</div>;
  }

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
