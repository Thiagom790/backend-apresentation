import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./routers";
import cors from "cors";
import ws from "ws";

const server = createHTTPServer({
  middleware: cors({ origin: "*" }),
  router: appRouter,
});

const wss = new ws.Server({
  server,
});

applyWSSHandler({ wss, router: appRouter });

console.log("listening on http://localhost:3000");

server.listen(3000);
