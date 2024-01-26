import { router, procedure, TRPCError } from "./trpc-utils";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "node:stream";
import { z } from "zod";

// Fake database
const users = [
  { id: 1, name: "test" },
  { id: 2, name: "test2" },
];

// Subscription
const eventEmitter = new EventEmitter();

type Notification = {
  title: string;
  message: string;
};

export const appRouter = router({
  hello: procedure.query(() => "hello world"),
  users: router({
    getList: procedure.query(() => users),
    getById: procedure
      .input((val) => {
        // Example of validation of objects
        // if (typeof val === "object" && val !== null && "name" in val) {
        //   return val.name;
        // }

        // throw new TRPCError({
        //   code: "BAD_REQUEST",
        //   message: "name must be a object with a name property",
        // });
        if (typeof val !== "number") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "id must be a number",
          });
        }

        return val;
      })
      .query((opts) => {
        return users.find((u) => u.id === opts.input);
      }),
    getByName: procedure.input(z.object({ name: z.string() })).query((opts) => {
      return users.find((u) => u.name === opts.input.name);
    }),
    create: procedure.input(z.object({ name: z.string() })).mutation((opts) => {
      const user = { id: users.length + 1, name: opts.input.name };
      users.push(user);
      return user;
    }),
  }),
  notifications: router({
    listenChanges: procedure.subscription(() => {
      return observable<Notification>((emit) => {
        eventEmitter.on("notification", ({ title, message }) => {
          emit.next({ title, message });
        });

        return () => {
          eventEmitter.off("notification", ({ title, message }) => {
            emit.next({ title, message });
          });
        };
      });
    }),
    sendNotification: procedure
      .input(z.object({ title: z.string(), message: z.string() }))
      .mutation((opts) => {
        eventEmitter.emit("notification", opts.input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
