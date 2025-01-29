"use client";

import { uploadPdfSchema } from "@/schemas/uploadPdfSchema";
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
import { storage, db, auth } from "@/utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

type FormValues = z.infer<typeof uploadPdfSchema>;

export default function UploadPdfForm() {
  const [message, setMessage] = useState("");
  const [user] = useAuthState(auth);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(uploadPdfSchema),
    defaultValues: {
      file: undefined,
      customName: "",
    },
    mode: "onBlur",
  });

  const router = useRouter();

  const handleUpload = async () => {
    const { file, customName } = form.getValues();
    if (file == undefined || !user) {
      return console.log("No file selected or not signed in!");
    }
    setUploading(true);
    const fileRef = ref(storage, `users/${user.uid}/pdfs/${file.name}`);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress
      },
      (error) => {
        // Handle error
        setUploading(false);
        console.log("Upload failed!");
      },
      async () => {
        // Handle successful upload
        const downloadURL = await getDownloadURL(fileRef);

        // Save file metadata to Firestore
        await addDoc(collection(db, "users", user.uid, "pdfs"), {
          name: file.name,
          url: downloadURL,
          createdAt: serverTimestamp(),
          customName: customName,
        });
        setUploading(false);
        setUploadSuccess(true);
        console.log("Upload successful!");
      }
    );
  };

  const onSubmit = (data: FormValues) => {
    handleUpload();
  };

  return (
    <div>
      {message ? (
        <h2 className="text-xl font-bold text-center">{message}</h2>
      ) : null}
      <FormProvider {...form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* File */}
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        form.setValue("file", e.target.files[0]);
                      }}
                      className="bg-gray-800 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Name */}
            <FormField
              control={form.control}
              name="customName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter custom name"
                      {...field}
                      onChange={(e) =>
                        form.setValue("customName", e.target.value)
                      }
                      className="bg-gray-800 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div>
              <Button
                type="submit"
                onClick={handleUpload}
                disabled={uploading}
                className={`${
                  uploadSuccess
                    ? "bg-green-500 hover:bg-green-700"
                    : "bg-blue-500 hover:bg-blue-700"
                } text-white font-bold py-2 px-4 rounded`}
              >
                {uploadSuccess ? "File Uploaded Successfully" : "Upload"}
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
