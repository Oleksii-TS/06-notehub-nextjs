import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function Notes() {
  const initialQuery = "";
  const initialPage = 1;

  const { notes, totalPages } = await fetchNotes(initialQuery, initialPage);

  return (
    <NotesClient
      initialQuery={initialQuery}
      initialPage={initialPage}
      initialNotes={notes}
      initialTotalPages={totalPages}
    />
  );
}
