"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "@/utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { DataTable } from "@/app/library/data-table";
import { Pdf, columns } from "@/app/library/columns";

export default function UserPdfsTable() {
  const [user, loading] = useAuthState(auth);
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoadingData(true);
      if (!user) return;
      const pdfsRef = collection(db, "users", user.uid, "pdfs");
      const q = query(pdfsRef, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      const fetchedPdfs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        custom_name: doc.data().customName || "Untitled",
        file_name: doc.data().name || "Unknown",
        url: doc.data().url,
        added_at: doc.data().createdAt?.toDate() || new Date(),
      }));

      setPdfs(fetchedPdfs);
      setLoadingData(false);
    }

    fetchData();
  }, [user]);

  if (loading) return <p className="text-white">Checking authentication...</p>;
  if (!user)
    return <p className="text-white">Please log in to see your PDFs.</p>;

  return (
    <div className="container mx-auto py-10">
      {loadingData ? (
        <p className="text-white">Loading PDFs...</p>
      ) : pdfs.length > 0 ? (
        <DataTable columns={columns} data={pdfs} />
      ) : (
        <p className="text-white">No PDFs found. Upload one!</p>
      )}
    </div>
  );
}
