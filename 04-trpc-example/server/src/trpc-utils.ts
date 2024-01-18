import { initTRPC } from "@trpc/server";
export { TRPCError } from "@trpc/server";

// initialize
export const t = initTRPC.create();

// routers creator and procedure creator
export const router = t.router;
export const procedure = t.procedure;
