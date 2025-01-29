import { z } from "zod";

export const uploadPdfSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => ["application/pdf"].includes(file.type), {
      message: "Invalid document file type",
    }),
  customName: z.string().min(3).max(100),
});
