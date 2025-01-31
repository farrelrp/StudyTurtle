import UploadPdfModal from "@/components/UploadPdfModal";
import UserPdfsTable from "@/components/UserPdfTable";

export default function LibraryPage() {
  return (
    <div className="flex flex-col gap-6 px-5 py-5">
      <h1 className="text-3xl font-extrabold text-white">Library Page</h1>
      <p className="text-xl text-white">
        This is the library page. You can upload your study materials here.
      </p>

      <div className="flex justify-center items-center w-full">
        <UploadPdfModal />
      </div>
      <UserPdfsTable />
    </div>
  );
}
