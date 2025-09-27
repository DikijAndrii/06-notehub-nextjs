// app/notes/page.tsx (Server Component)
import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";

import TanStackProvider from "../../components/TanStackProvider/TanStackProvider";
import NotesClient from "./Notes.client";
import { fetchNotes } from "../../lib/api";

interface Props {
  searchParams: { page: string; search: string };
}

export default async function NotesPage({ searchParams }: Props) {
  const page = Number(searchParams?.page ?? 1);
  const perPage = 12;
  const search = searchParams?.search ?? "";

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["notes", page, perPage, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
  });

  const dehydratedState = dehydrate(qc);

  return (
    <TanStackProvider dehydratedState={dehydratedState}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
      />
    </TanStackProvider>
  );
}
