import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./routers";
import cors from "cors";

const server = createHTTPServer({
  middleware: cors({ origin: "*" }),
  router: appRouter,
});

server.listen(3000);
