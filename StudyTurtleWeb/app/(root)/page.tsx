import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <div className="flex justify-center items-center h-svh 0 flex-col gap-4 max-h-[70vh]">
        <h1 className="text-4xl font-bold text-center">
          Welcome to StudyTurtle!
        </h1>
        <h2 className="text-lg text-center">
          StudyTurtle is a platform to upload your study materials,
          <br /> then with the power of AI, it will help create flashcards for
          you to study better!
        </h2>
        <Link href={"/library"}>
          <Button className=" bg-green-500">Go to library!</Button>
        </Link>
      </div>
    </div>
  );
}
