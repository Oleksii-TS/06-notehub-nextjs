"use client";
import { useState } from "react";
import {
  useQuery,
  UseQueryResult,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { fetchNotes, createNote, NotesHttpResponse } from "@/lib/api";
import { FormValues } from "../../types/note";
import { useDebounce } from "../../hooks/useDebouncedValue";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "../notes/NotesPage.module.css";
import Loader from "@/components/Loader/Loader";
import toast from "react-hot-toast";
import ToastContainer from "@/components/ToastContainer/ToastContainer";

interface NotesClientProps {
  initialQuery: string;
  initialPage: number;
}

export default function NotesClient({
  initialQuery,
  initialPage,
}: NotesClientProps) {
  const [search, setSearch] = useState(initialQuery);
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError }: UseQueryResult<NotesHttpResponse, Error> =
    useQuery<NotesHttpResponse>({
      queryKey: ["notes", page, debouncedSearch],
      queryFn: () => fetchNotes(debouncedSearch, page),
      placeholderData: keepPreviousData,
    });

  const mutation = useMutation({
    mutationFn: (noteData: FormValues) => createNote(noteData),
    onSuccess: () => {
      toast.success("Note created successfully");
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
    onError: () => toast.error("Error creating note"),
  });

  const notes = data?.notes || [];
  const pageCount = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <ToastContainer />

      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p>Error loading notes</p>
      ) : notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {mutation.isPending ? (
            <Loader size={40} color="#0d6efd" />
          ) : (
            <NoteForm
              onCancel={() => setIsModalOpen(false)}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
