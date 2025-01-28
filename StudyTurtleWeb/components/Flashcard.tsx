"use client";
import { useState } from "react";

type FlashcardProps = {
  question: string;
  answers?: string[]; // Make answers optional
  correct: string;
};

const Flashcard = ({ question, answers = [], correct }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="bg-white p-4 rounded-md shadow-md border text-black cursor-pointer "
      onClick={() => setFlipped(!flipped)}
      style={{ height: "240px", width: "300px", margin: "10px" }} // Set a fixed height and width for the card
    >
      {flipped ? (
        <div className="flex flex-col gap-2 justify-center items-center text-center">
          <h2 className="text-xl font-bold mb-2">Correct Answer</h2>
          <div className="text-lg">{correct}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center text-center">
          <h2 className="text-xl font-bold mb-1">{question}</h2>
          <div>
            {answers.map((ans, i) => (
              <div key={i} className="text-lg">
                {ans}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
