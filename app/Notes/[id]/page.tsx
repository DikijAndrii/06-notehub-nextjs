// app/notes/[id]/page.tsx (Server Component)
import { dehydrate, QueryClient } from "@tanstack/react-query";
import TanStackProvider from "../../../components/TanStackProvider/TanStackProvider";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "../../../lib/api";

interface Props {
  params: { id: string };
}

export default async function NoteDetailsPage({ params }: Props) {
  const id = params.id;
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(qc);

  return (
    <TanStackProvider dehydratedState={dehydratedState}>
      <NoteDetailsClient id={id} />
    </TanStackProvider>
  );
}
