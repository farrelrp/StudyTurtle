"use client";

import React from "react";
import { Button } from "./ui/button";

export function DeleteFileButton({ pdfId }: { pdfId: string }) {
  return <Button className="bg-red-900">Delete File</Button>;
}
