import axios, { type AxiosResponse } from "axios";
import type { Note } from "../types/note";

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string;

export const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: TOKEN ? `Bearer ${TOKEN}` : "",
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (params: FetchNotesParams) => {
  const res: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params,
  });
  return res.data;
};

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: Note["tag"];
}

export const createNote = async (payload: CreateNoteDto) => {
  const res: AxiosResponse<Note> = await api.post("/notes", payload);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
};

export async function fetchNoteById(id: string): Promise<Note> {
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
}
