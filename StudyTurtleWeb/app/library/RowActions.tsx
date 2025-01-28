import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RowActions({ pdfId }: { pdfId: string }) {
  return (
    <Link href={`/library/create_flashcard/${pdfId}`}>
      <Button>Create Flashcards</Button>
    </Link>
  );
}
