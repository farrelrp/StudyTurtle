import { OpenAIEmbeddings } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import pdf from "pdf-parse";

export async function GET() {
  console.log("GET request received");
  return NextResponse.json({ message: "GET route works!" });
}

export async function POST(req: NextRequest) {
  console.log("POST request started");

  try {
    const { PDFParser } = await import("pdf2json");

    const { pdfId, userId, idToken } = await req.json();
    console.log("Token:", idToken);
    console.log("Processing request for:", { pdfId, userId });

    const docRef = doc(db, "users", userId, "pdfs", pdfId);
    console.log("Fetching PDF metadata from Firestore:", docRef.path);
    const docSnap = await getDoc(docRef);
    console.log("EXIST DOCSNAP " + !docSnap.exists());
    console.log("docSnap", docSnap);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "PDF metadata not found" },
        { status: 404 }
      );
    }

    const pdfUrl = docSnap.data().url;
    console.log("PDF URL:", pdfUrl);
    console.log("Fetching PDF from URL:", pdfUrl);

    const response = await fetch(pdfUrl, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate buffer
    console.log("Buffer length:", buffer.length);
    if (buffer.length === 0) throw new Error("Empty PDF buffer");
    if (!buffer.subarray(0, 5).toString().startsWith("%PDF-")) {
      throw new Error("Invalid PDF content");
    }

    let pdfText = "";

    try {
      const pdfParsedData = await pdf(buffer);
      pdfText = pdfParsedData.text.trim();
      console.log("PDF-parse text length:", pdfText.length);
    } catch (parseError) {
      console.error("pdf-parse error:", parseError);
    }

    if (!pdfText) {
      try {
        pdfText = await new Promise<string>((resolve, reject) => {
          const pdfParser = new PDFParser();
          let text = "";

          pdfParser.on("pdfParser_dataReady", (data) => {
            text = data.Pages.map((page) =>
              page.Texts.map((t) => decodeURIComponent(t.R[0].T)).join(" ")
            )
              .join("\n")
              .trim();
            resolve(text);
          });

          pdfParser.on("pdfParser_dataError", reject);
          pdfParser.parseBuffer(buffer);
        });
        console.log("pdf2json text length:", pdfText.length);
      } catch (parserError) {
        console.error("pdf2json error:", parserError);
      }
    }

    if (!pdfText) {
      throw new Error("Unable to extract text from PDF");
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 80,
    });

    const chunks = await splitter.splitText(pdfText);
    console.log("Created chunks:", chunks.length);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const embeddedChunks = await embeddings.embedDocuments(chunks);
    console.log("Generated embeddings");

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pinecone.index("studyturtle");
    await index.namespace(pdfId).upsert(
      embeddedChunks.map((embedding, i) => ({
        id: `${pdfId}_${i}`,
        values: embedding,
        metadata: {
          pdfId,
          text: chunks[i],
          chunkIndex: i,
        },
      }))
    );

    console.log("Uploaded to Pinecone");

    return NextResponse.json(
      { message: "Embedding completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
