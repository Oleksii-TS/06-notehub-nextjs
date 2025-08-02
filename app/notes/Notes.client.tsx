"use client";

import { useState } from "react";
import {
  useQuery,
  useQueryClient,
  useMutation,
  UseQueryResult,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchNotes, createNote, NotesHttpResponse } from "@/lib/api";
import type { FormValues, Note } from "@/types/note";
import { useDebounce } from "@/hooks/useDebouncedValue";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { Loader } from "@/components/Loader/Loader";
import { ErrorMessageEmpty } from "@/components/ErrorMessageEmpty/ErrorMessageEmpty";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import toast from "react-hot-toast";
import css from "../notes/NotesPage.module.css";

interface NotesClientProps {
  initialQuery: string;
  initialPage: number;
  initialNotes: Note[];
  initialTotalPages: number;
}

export default function NotesClient({
  initialQuery,
  initialPage,
  initialNotes,
  initialTotalPages,
}: NotesClientProps) {
  const [search, setSearch] = useState(initialQuery);
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
  }: UseQueryResult<NotesHttpResponse, Error> = useQuery<NotesHttpResponse>({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    initialData:
      page === initialPage && debouncedSearch === initialQuery
        ? {
            notes: initialNotes,
            totalPages: initialTotalPages,
          }
        : undefined,
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation({
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

  if (isError && error) throw error;

  return (
    <div className={css.app}>
      <ToastContainer />

      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        {pageCount > 1 && (
          <Pagination
            totalPages={pageCount}
            currentPage={page}
            onPageChange={({ selected }) => setPage(selected + 1)}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}

      {!isLoading && !isError && (
        <>
          {notes.length > 0 ? (
            <NoteList notes={notes} />
          ) : (
            <ErrorMessageEmpty />
          )}
        </>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {createNoteMutation.isPending ? (
            <Loader />
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
