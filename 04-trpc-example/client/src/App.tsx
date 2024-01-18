import { trpc } from "./trpc-utils";

function App() {
  const titleResponse = trpc.hello.useQuery();
  const users = trpc.users.getList.useQuery();
  const user = trpc.users.getById.useQuery(1);

  const utils = trpc.useUtils();
  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      utils.users.getList.invalidate();
    },
  });

  return (
    <main>
      <h1>Ola mundo {titleResponse.data}</h1>

      <h2>Users</h2>
      <pre>{JSON.stringify(users.data, null, 2)}</pre>

      <h2>User</h2>
      <pre>{JSON.stringify(user.data, null, 2)}</pre>

      <button onClick={() => createUser.mutate({ name: "test" })}>Add</button>
    </main>
  );
}

export default App;
