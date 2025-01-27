import Flashcard from "@/components/Flashcard";
import React from "react";

function FlashcardsPage() {
  return (
    <>
      <div className="flex justify-start items-start w-full px-5 py-5 flex-col gap-2 max-w-fit">
        <h1 className="text-3xl text-white font-extrabold">Flashcards Page</h1>
        <p className="text-xl text-white">
          This is the flashcards page. You can study your flashcards here.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 py-5 px-5">
        <Flashcard />
      </div>
    </>
  );
}

export default FlashcardsPage;
