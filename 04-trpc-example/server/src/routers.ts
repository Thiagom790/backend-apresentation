import { router, procedure, TRPCError } from "./trpc-utils";
import { z } from "zod";

const users = [
  { id: 1, name: "test" },
  { id: 2, name: "test2" },
];

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
});

export type AppRouter = typeof appRouter;
