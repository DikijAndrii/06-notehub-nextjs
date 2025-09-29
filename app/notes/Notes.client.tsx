"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote } from "../../lib/api";
import type { Note } from "../../types/note";
import SearchBox from "../../components/SearchBox/SearchBox";
import PaginationComp from "../../components/Pagination/Pagination";
import NoteForm from "../../components/NoteForm/NoteForm";
import css from "./page.module.css";

import Modal from "@/components/Modal/Modal";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import NoteList from "@/components/NoteList/NoteList";

interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
  perPage: number;
}

export default function NotesClient({
  initialPage,
  initialSearch,
  perPage,
}: NotesClientProps) {
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 1000);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", { page, perPage: perPage, search: debouncedSearch }],
    queryFn: () =>
      fetchNotes({ page, perPage: perPage, search: debouncedSearch }),
    placeholderData: (prev) => prev,
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
          <NoteList notes={notes} />
        </>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={(values: {
              title: string;
              content: string;
              tag: Note["tag"];
            }) => createMutation.mutate(values)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
