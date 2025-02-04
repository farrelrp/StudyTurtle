# 📚 StudyTurtle 🐢

_A smarter way to study with AI-powered flashcards!_

## 🏗 About StudyTurtle

StudyTurtle is an AI-powered **flashcard generation website** designed to help users study efficiently. Simply upload your PDFs, and StudyTurtle will generate context-aware flashcards using an LLM.

This is a mini-project where I explore full-stack web development while integrating LLMs to create an AI-powered study tool.

## 🚀 Features

- ✅ **AI-Powered Flashcards** – Automatically generates flashcards from your PDFs.
- ✅ **Customizable Output** – Request which topic to focus on or how hard your flashcards are through request prompts.
- ✅ **Interactive Learning** – Test yourself with dynamic flashcards.

## 🛠 Tech Stack

| **Category**   | **Technology**            |
|----------------|---------------------------|
| **Frontend & Backend**   | Next.js (TypeScript)      |
| **Database**   | Firebase (Firestore & Storage) |
| **Vector DB**  | Pinecone                  |
| **Hosting**    | Coming Soon         |

## 🎯 How It Works?

1. **Upload a PDF** – Your document is stored in Firebase Storage.
2. **AI Processes It** – The text is embedded into Pinecone for quick retrieval.
3. **Flashcards Are Generated** – The LLM creates flashcards based on the content.
4. **Start Studying!** – The flashcards appear on your dashboard, ready for review.
