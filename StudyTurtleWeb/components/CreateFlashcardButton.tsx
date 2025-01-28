"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CreateFlashcardButton({ pdfId }: { pdfId: string }) {
  return (
    <Link href={`/library/create_flashcard/${pdfId}`}>
      <Button className="bg-blue-900">Create Flashcards</Button>
    </Link>
  );
}
