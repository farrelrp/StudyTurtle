import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import { useState } from "react";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/utils/firebase";

export function DeleteFileButton({ pdfId }: { pdfId: string }) {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // get ref to pdf
      const pdfDocRef = doc(db, "users", user.uid, "pdfs", pdfId);

      const pdfSnapshot = await getDoc(pdfDocRef); // get pdf data
      if (!pdfSnapshot.exists()) {
        throw new Error("PDF not found!");
      }
      const fileUrl = pdfSnapshot.data().url; // get file url

      if (fileUrl) {
        // delete file from storage
        const fileRef = ref(storage, decodeURIComponent(fileUrl.split("?")[0]));
        console.log("Deleting file", fileRef);
        await deleteObject(fileRef);
      }

      await deleteDoc(pdfDocRef); // delete pdf data from firestore

      console.log(`PDF ${pdfId} deleted`);
    } catch (error) {
      console.error("Error :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="bg-red-700"
          disabled={loading}
          onClick={() => setOpen(true)}
        >
          {loading ? "Deleting..." : "Delete PDF"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your PDF
            from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-700"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
