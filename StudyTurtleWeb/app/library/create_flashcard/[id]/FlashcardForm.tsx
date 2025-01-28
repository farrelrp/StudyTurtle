"use client";

import { formScehma } from "@/schemas/formSchema";
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
import { InputWithLabel } from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type FormValues = z.infer<typeof formScehma>;

export default function FlashcardForm({ pdfId }: { pdfId: string }) {
  const [message, setMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formScehma),
    defaultValues: {
      pdfId: pdfId,
      numQuestions: 3,
      additionalRequest:
        "I want the flashcards to focus on the key concepts of the file.",
    },
    mode: "onBlur",
  });

  const router = useRouter();

  async function onSubmit() {
    console.log(form.getValues());
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
            {/* Number of Questions Field */}
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

            {/* Additional Request Field */}
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
              <Button type="submit">Create Flashcards</Button>
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
