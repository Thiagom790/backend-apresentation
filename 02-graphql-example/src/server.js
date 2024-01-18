import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

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

const typeDefs = `
    type User {
        id: Int!
        name: String!
        organizations: [Organization]
    }

    type Organization {
        id: Int!
        name: String!
        user_id: Int!
        contas: [Conta]
    }

    type Conta {
        id: Int!
        name: String!
        org_id: Int!
    }

    type Query {
        users: [User]  
        organizations(org_name: String): [Organization]      
    }    

    input CreateOrganizationInput {
        name: String!
        user_id: Int!
    }

    type Mutation {
        createUser(name: String!): User
        createOrganization(org_info: CreateOrganizationInput): Organization
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
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server running at: ${url}`);
