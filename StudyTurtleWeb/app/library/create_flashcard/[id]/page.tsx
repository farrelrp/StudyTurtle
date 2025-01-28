import FlashcardForm from "./FlashcardForm";

async function CreateFlashcard({
  // is this the best way to do it? to make the whole page async since i have to fetch params?
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const pdfId = (await params).id;

  if (!pdfId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1>Create Flashcard</h1>
      <FlashcardForm pdfId={pdfId as string} />
    </div>
  );
}

export default CreateFlashcard;
