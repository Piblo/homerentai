"use client";

import {
  QueryClientProvider as Provider,
  QueryClient,
} from "@tanstack/react-query";

import { useState } from "react";

export const QueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client] = useState(() => new QueryClient());

  return <Provider client={client}>{children}</Provider>;
};
