import { z } from "zod";

export const formScehma = z.object({
  pdfId: z.string(),
  numQuestions: z.number().int().min(3).max(15),
  additionalRequest: z.string().max(500).optional(),
});
