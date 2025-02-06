"use client";

import { uploadPdfSchema } from "@/schemas/uploadPdfSchema";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { storage, db, auth } from "@/utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { generate } from "short-uuid";

type FormValues = z.infer<typeof uploadPdfSchema>;

export default function UploadPdfForm() {
  const [message, setMessage] = useState("");
  const [user] = useAuthState(auth);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const pdfId = generate();

  const form = useForm<FormValues>({
    resolver: zodResolver(uploadPdfSchema),
    defaultValues: {
      file: undefined,
      customName: "",
    },
    mode: "onBlur",
  });

  const handleUpload = async () => {
    const { file, customName } = form.getValues();
    if (!file || !user) {
      console.log("No file selected or not signed in!");
      return;
    }

    setUploading(true);

    try {
      // 1. Upload to firestore and firebase storage
      const fileRef = ref(storage, `users/${user.uid}/pdfs/${pdfId}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          setUploading(false);
          console.error("Upload failed:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(fileRef);
          const pdfDocRef = doc(db, "users", user.uid, "pdfs", pdfId);
          await setDoc(pdfDocRef, {
            name: file.name,
            url: downloadURL,
            createdAt: serverTimestamp(),
            customName: customName,
            id: pdfId,
          });
          console.log("Upload pdf successful done, proceed to embedding");

          // Call the embedding API here
          try {
            const idToken = await user.getIdToken();
            console.log("ID TOKEN " + idToken);
            console.log("BODY " + JSON.stringify({ pdfId, userId: user.uid }));
            const embedRes = await fetch("/api/pinecone/upload-embedding", {
              method: "POST",
              body: JSON.stringify({
                pdfId,
                userId: user.uid,
                idToken: idToken,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            console.log("EMBED RES " + embedRes);
            const embedData = await embedRes.json();
            console.log(embedData.message);
            console.log("Upload done");
            setUploading(false);

            setUploadSuccess(true);
          } catch (error) {
            console.error("Error calling embedding API:", error);
          }
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  //   // Check user state
  //   console.log("User is:", user);
  //   const idToken = await getAuth().currentUser?.getIdToken();
  //   if (user) {
  //     console.log("TEST");
  //     console.log("idToken", idToken); // This should print the token if the user is authenticated
  //   } else {
  //     console.log("User is not authenticated or signed in.");
  //   }

  //   const embedRes = await fetch("/api/pinecone/upload-embedding", {
  //     method: "POST",
  //     body: JSON.stringify({ pdfId, userId: user.uid }),
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${idToken}`,
  //     },
  //   });
  //   const embedData = await embedRes.json();
  //   console.log(embedData.message);
  // } catch (error) {
  //   console.error("Error uploading file:", error);
  //   setUploading(false);
  // }
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are allowed!");
      form.setValue("file", undefined);
      e.target.value = "";
    } else {
      setFileError(null);
      form.setValue("file", file);
    }
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
                      onChange={handleFileChange}
                      className="bg-gray-800 text-white"
                      accept=".pdf"
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
