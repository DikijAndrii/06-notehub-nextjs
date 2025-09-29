import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "../../lib/api";

interface Props {
  searchParams: Promise<{ page: string; search: string }>;
}

export default async function NotesPage({ searchParams }: Props) {
  const page = Number((await searchParams)?.page ?? 1);
  const perPage = 12;
  const search = (await searchParams)?.search ?? "";

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", page, perPage, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
      />
    </HydrationBoundary>
  );
}
