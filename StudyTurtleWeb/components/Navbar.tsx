"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signInWithGoogle, signOutGoogle } from "@/utils/firebase";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="px-5 py-5 outline-none outline-white w-full z-10 top-0">
      <nav
        className="flex justify-between items-center text-white relative shadow-sm font-mono"
        role="navigation"
      >
        <div className="flex-1"></div>

        <Link href={"/"} className="flex justify-center">
          <h1 className="font-extrabold text-2xl text-white">StudyTurtle</h1>
        </Link>

        <div className="flex-1 flex justify-end gap-4">
          <Link href="/library" className="hover:text-gray-300">
            Library
          </Link>
          <Link href="/flashcards" className="hover:text-gray-300">
            Flashcards
          </Link>

          {user ? (
            <span className="flex items-center gap-4">
              <span className="text-gray-200">
                {user.displayName || user.email}
              </span>
              <button onClick={signOutGoogle} className="hover:text-gray-300">
                Sign Out
              </button>
            </span>
          ) : (
            <button onClick={signInWithGoogle} className="hover:text-gray-300">
              Sign In with Google
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
