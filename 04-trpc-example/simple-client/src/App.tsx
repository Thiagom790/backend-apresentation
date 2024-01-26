import { useState } from "react";
import { trpc } from "./trpc-utils";
import { v4 as uuid } from "uuid";

function Subscription() {
  const [data, setData] = useState({ title: "", message: "" });

  trpc.notifications.listenChanges.useSubscription(undefined, {
    onData(data) {
      setData(data);
    },
  });

  const mutation = trpc.notifications.sendNotification.useMutation({});

  return (
    <div>
      <h2>Subscription</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button
        onClick={() => mutation.mutate({ message: "test", title: uuid() })}
      >
        criar
      </button>
    </div>
  );
}

function QueryAndMutation() {
  const users = trpc.users.getList.useQuery();
  const user = trpc.users.getById.useQuery(1);
  const utils = trpc.useUtils();

  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      utils.users.getList.invalidate();
    },
  });

  return (
    <div>
      <h2>Users</h2>
      <pre>{JSON.stringify(users.data, null, 2)}</pre>

      <h2>User</h2>
      <pre>{JSON.stringify(user.data, null, 2)}</pre>

      <button onClick={() => createUser.mutate({ name: "test" })}>Add</button>
    </div>
  );
}

function App() {
  const titleResponse = trpc.hello.useQuery();

  return (
    <main>
      <h1>Ola mundo {titleResponse.data}</h1>

      <Subscription />
      <QueryAndMutation />
    </main>
  );
}

export default App;
