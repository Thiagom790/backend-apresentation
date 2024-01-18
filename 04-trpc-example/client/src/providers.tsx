import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc-utils.ts";
import { httpBatchLink } from "@trpc/client";

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
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
