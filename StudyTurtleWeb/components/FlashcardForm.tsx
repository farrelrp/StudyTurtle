"use client";

import { flashcardFormSchema } from "@/schemas/flashcardFormSchema";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";

type FormValues = z.infer<typeof flashcardFormSchema>;

export default function FlashcardForm({ pdfId }: { pdfId: string }) {
  const [message, setMessage] = useState("");
  const [user] = useAuthState(auth);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(flashcardFormSchema),
    defaultValues: {
      pdfId: pdfId,
      numQuestions: 3,
      additionalRequest:
        "I want the flashcards to focus on the key concepts of the file.",
    },
    mode: "onBlur",
  });

  const router = useRouter();

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      setMessage("Generating flashcards...");

      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId: user?.uid,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setMessage("Flashcards generated successfully!");
      console.log("Generated flashcards:", data.flashcards);

      router.push(`/flashcards/${data.flashcardId}`);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to generate flashcards. Please try again.");
    } finally {
      setSubmitting(false);
      form.reset();
    }
  }

  return (
    <div>
      {message ? (
        <h2 className="text-xl font-bold text-center">{message}</h2>
      ) : null}
      <FormProvider {...form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Number of Questions */}
            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of questions"
                      {...field}
                      onChange={(e) =>
                        form.setValue("numQuestions", Number(e.target.value))
                      }
                      className="bg-gray-800 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Request */}
            <FormField
              control={form.control}
              name="additionalRequest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Request</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional requests"
                      {...field}
                      className="resize-y h-24 bg-gray-800 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Flashcards"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
