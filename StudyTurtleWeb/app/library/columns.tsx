"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RowActions } from "./RowActions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  file_name: string;
  added_at: Date;
};

export const columns: ColumnDef<Payment>[] = [
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
    cell: ({ row }) => <RowActions pdfId={row.original.id} />,
  },
];
