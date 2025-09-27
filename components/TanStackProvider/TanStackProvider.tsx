// components/TanStackProvider/TanStackProvider.tsx
"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  type DehydratedState,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}

export default function TanStackProvider({ children, dehydratedState }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
