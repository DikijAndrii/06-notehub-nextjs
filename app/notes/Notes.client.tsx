"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "../../lib/api";
import type { Note } from "../../types/note";
import SearchBox from "../../components/SearchBox/SearchBox";
import PaginationComp from "../../components/Pagination/Pagination";
import NoteForm from "../../components/NoteForm/NoteForm";
import css from "./page.module.css";
import Link from "next/link";

interface Props {
  initialPage: number;
  initialSearch: string;
  perPage: number;
}

export default function NotesClient({
  initialPage,
  initialSearch,
  perPage,
}: Props) {
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", page, perPage, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      content: string;
      tag: Note["tag"];
    }) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.container}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        {totalPages > 1 && (
          <PaginationComp
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          className={css.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading notes</div>
      ) : notes.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        <>
          {isFetching && <div className={css.fetching}>Loading page...</div>}
          <ul className={css.list}>
            {notes.map((note) => (
              <li key={note.id} className={css.listItem}>
                <h3 className={css.title}>{note.title}</h3>
                <p className={css.content}>{note.content}</p>
                <div className={css.footer}>
                  <span className={css.tag}>{note.tag}</span>
                  <Link href={`/notes/${note.id}`} className={css.detailsLink}>
                    View details
                  </Link>
                  <button
                    className={css.deleteButton}
                    onClick={() => deleteMutation.mutate(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {isModalOpen && (
        <div className={css.modalWrapper}>
          <NoteForm
            onSuccess={(values: {
              title: string;
              content: string;
              tag: Note["tag"];
            }) => createMutation.mutate(values)}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
