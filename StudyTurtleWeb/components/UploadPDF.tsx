"use client";

import { useState } from "react";
import { storage, db, auth } from "@/utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UploadPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [user] = useAuthState(auth);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return alert("No file selected or not signed in!");

    setUploading(true);
    const fileRef = ref(storage, `users/${user.uid}/pdfs/${file.name}`);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on("state_changed", (snapshot) => async () => {
      const downloadURL = await getDownloadURL(fileRef);

      // Save file metadata to Firestore
      await addDoc(collection(db, "users", user.uid, "pdfs"), {
        name: file.name,
        url: downloadURL,
        createdAt: serverTimestamp(),
      });

      setUploading(false);
      alert("Upload successful!");
    });
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        id="file-input"
        className="hidden"
        onChange={handleFileChange}
        accept="application/pdf"
      />
      <Button onClick={() => document.getElementById("file-input")?.click()}>
        {file ? file.name : "Choose PDF"}
      </Button>

      <Button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 on-hover:bg-green-200"
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </Button>
    </div>
  );
};

export default UploadPdf;
