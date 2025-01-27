import Link from "next/link";
import React from "react";
import { signIn, signOut, auth } from "@/auth";

async function Navbar() {
  const session = await auth();
  return (
    <div className="px-5 py-5 outline-none outline-white w-full z-10 top-0">
      <nav
        className="flex justify-between items-center text-white relative shadow-sm font-mono"
        role="navigation"
      >
        <div className="flex-1"></div>

        <Link href={"/"} className="flex justify-center">
          {/* <img src="https://placehold.co/200x30" alt="Logo" /> */}
          <h1 className="font-extrabold text-2xl text-white">StudyTurtle</h1>
        </Link>

        <div className="flex-1 flex justify-end gap-4">
          <Link href="/library" className="hover:text-gray-300">
            Library
          </Link>
          <Link href="/flashcards" className="hover:text-gray-300">
            Flashcards
          </Link>

          {!session ? (
            <span className="flex items-center gap-4">
              <button
                onClick={async () => {
                  "use server";
                  signOut();
                }}
                className="hover:text-gray-300"
              >
                Sign Out
              </button>
            </span>
          ) : (
            <button
              onClick={async () => {
                "use server";
                signIn();
              }}
              className="hover:text-gray-300"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
