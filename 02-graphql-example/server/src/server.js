// import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import express from "express";
import { createServer } from "node:http";
import { PubSub } from "graphql-subscriptions";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";

// Fake db
const users = [
  { id: 1, name: "test" },
  { id: 2, name: "test2" },
];

const organizations = [
  { id: 1, name: "org1", user_id: 1 },
  { id: 2, name: "org2", user_id: 1 },
  { id: 3, name: "org3", user_id: 2 },
];

const contas = [
  { id: 1, name: "conta1", org_id: 1 },
  { id: 2, name: "conta2", org_id: 2 },
  { id: 3, name: "conta3", org_id: 3 },
];

// Apollo Server schemas and resolvers

const typeDefs = `
  type User {
    id: Int
    name: String
    organizations: [Organization]
  }

  type Organization {
    id: Int
    name: String
    user_id: Int
    contas: [Conta]
  }

  type Conta {
    id: Int
    name: String
    org_id: Int
  }

  type NewsEvent {
    title: String
    description: String
  }

  input CreateOrganizationInput {
    name: String
    user_id: Int
  }

  type Query {
    users: [User]
    organizations(org_name: String): [Organization]
  }

  type Mutation {
    createUser(name: String): User
    createOrganization(org_info: CreateOrganizationInput): Organization
    createNewsEvent(title: String, description: String): NewsEvent
  }

  type Subscription {
    newsFeed: NewsEvent
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    organizations: (_obj, args) => {
      const org_name = args.org_name;

      if (!org_name) {
        return organizations;
      }

      return organizations.filter((org) => org.name.includes(org_name));
    },
  },
  User: {
    // instead of obj we can use name parent
    organizations: (obj, _args) => {
      return organizations.filter((org) => org.user_id === obj.id);
    },
  },
  Organization: {
    contas: (obj, _args) => {
      return contas.filter((conta) => conta.org_id === obj.id);
    },
  },
  Mutation: {
    createUser: (_obj, args) => {
      const user = {
        id: users.length + 1,
        name: args.name,
      };

      users.push(user);

      return user;
    },
    createOrganization: (_obj, args) => {
      const org = {
        id: organizations.length + 1,
        name: args.org_info.name,
        user_id: args.org_info.user_id,
      };

      organizations.push(org);

      return org;
    },
    createNewsEvent: (_obj, args) => {
      const newsEvent = {
        title: args.title,
        description: args.description,
      };

      pubsub.publish("NEWS_EVENT", { newsFeed: newsEvent });

      return newsEvent;
    },
  },
  Subscription: {
    newsFeed: {
      subscribe: () => pubsub.asyncIterator(["NEWS_EVENT"]), // Wait for events getting published
    },
  },
};

/*
 * Simple version with standalone server
 *
 * const server = new ApolloServer({
 *   typeDefs,
 *   resolvers,
 * })
 *
 * const { url } = await startStandaloneServer(server, {
 *   listen: { port: 4000 },
 * });
 *
 * console.log(`🚀 Server ready at ${url}`);
 */

// Configuration to use subscriptions
// Server code
const app = express();
const pubsub = new PubSub(); //Publish and Subscribe, for subscriptions listening specific events
const httpServer = createServer(app);

// create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// create ws server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql", // localhost:4000/graphql
});

const serverCleanup = useServer({ schema }, wsServer);

// create ApolloServer
const server = new ApolloServer({
  schema,
  plugins: [
    // This code shutdown the http server and ws server
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

// start the server
await server.start();

// apply express middleware (cors, expressMiddleware, bodyParser, ...)
app.use(
  "/graphql",
  cors({ origin: "*" }),
  express.json(), // for parsing application/json
  expressMiddleware(server) // attach ApolloServer to express app
);

// http server start
httpServer.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
