import { z } from "zod";

export const pdfSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
});
