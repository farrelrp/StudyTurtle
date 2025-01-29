import React from "react";
import { Flashcard, columns } from "./columns";
import { DataTable } from "./data-table";
import UploadPdfModal from "@/components/UploadPdfModal";

async function getData() {
  // Fetch data from your API here.
  const data = Array.from({ length: 100 }, (_, index) => ({
    id: `728ed52f-${index}`,
    amount: 1020,
    file_name: `Slide ${index}.pdf`,
    added_at: `2021-09-0${index}`,
  }));
  return data;
}

async function LibraryPage() {
  const data = await getData();
  return (
    <>
      <div className="flex justify-start items-start w-full px-5 py-5 flex-col gap-2 max-w-full">
        <h1 className="text-3xl text-white font-extrabold">Library Page</h1>
        <p className="text-xl text-white">
          This is the library page. You can upload your study materials here.
        </p>
        <div className="flex justify-center items-center w-full">
          <UploadPdfModal />
        </div>
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}

export default LibraryPage;
