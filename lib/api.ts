import axios from "axios";
import { FormValues, Note } from "../types/note";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN!;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
};

export const fetchNotes = async (
  search: string,
  page: number
): Promise<NotesHttpResponse> => {
  const params = {
    ...(search && { search }),
    page,
    perPage: 12,
  };

  const response = await axios.get<NotesHttpResponse>(`${BASE_URL}/notes`, {
    params,
    headers,
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });

  return response.data;
};

export const createNote = async (note: FormValues): Promise<Note> => {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, note, {
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });
  return response.data;
};
