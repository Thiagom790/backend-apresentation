import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc-utils.ts";
import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: createWSClient({
          url: "ws://localhost:3000",
        }),
      }),
      false: httpBatchLink({
        url: "http://localhost:3000",
      }),
    }),
  ],
});

export const TrpcProvider = ({ children }: Props) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
