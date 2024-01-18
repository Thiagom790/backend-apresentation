import axios from "axios";

async function executeQuery(data) {
  try {
    const response = await axios({
      method: "POST",
      url: "http://localhost:4000",
      data,
    });

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(error.response.data);
  }
}

// Query
await executeQuery({
  query: `
    query {
        users { 
            name
            id
            organizations { 
                name
                contas {
                    name
                }
            }
        }
    }
`,
});

// Mutation
await executeQuery({
  query: `
    mutation {
        createUser(name: "John Doe") {
            name
            id
        }
    }`,
});
