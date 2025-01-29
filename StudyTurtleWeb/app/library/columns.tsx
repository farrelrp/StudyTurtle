"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CreateFlashcardButton } from "@/components/CreateFlashcardButton";
import FlashcardFormModal from "@/components/FlashcardFormModal";
import { DeleteFileButton } from "@/components/DeleteFileButton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Flashcard = {
  id: string;
  amount: number;
  file_name: string;
  added_at: Date;
};

export const columns: ColumnDef<Flashcard>[] = [
  {
    accessorKey: "file_name",
    header: "File Name",
  },
  {
    accessorKey: "added_at",
    header: "Added At",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2 justify-end max-w-fit">
        <FlashcardFormModal pdfId={row.original.id} />
        <DeleteFileButton pdfId={row.original.id} />
      </div>
    ),
  },
];
