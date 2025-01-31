"use client";

import { ColumnDef } from "@tanstack/react-table";
import FlashcardFormModal from "@/components/FlashcardFormModal";
import { DeleteFileButton } from "@/components/DeleteFileButton";

export type Pdf = {
  id: string;
  custom_name: string;
  file_name: string;
  added_at: Date;
};

export const columns: ColumnDef<Pdf>[] = [
  {
    accessorKey: "custom_name",
    header: "Name",
  },
  {
    accessorKey: "file_name",
    header: "File Name",
  },

  {
    accessorKey: "added_at",
    header: "Added At",
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
