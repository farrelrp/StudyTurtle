import { NextResponse } from "next/server";
import { adminAuth } from "./firebase-admin";

export async function verifyAuth(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Missing or invalid auth token");
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    return { uid: decodedToken.uid };
  } catch (error) {
    console.error("Auth error:", error);
    throw new Error("Unauthorized");
  }
}
