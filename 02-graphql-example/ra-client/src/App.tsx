import { Admin, Resource } from "react-admin";
import { ListUser } from "./resources/ListUser";
import { dataProvider, client } from "./providers/dataProvider";
import { ApolloProvider } from "@apollo/client";

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <Admin dataProvider={dataProvider}>
        <Resource name="users" list={ListUser} />
      </Admin>
    </ApolloProvider>
  );
};
