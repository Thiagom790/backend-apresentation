import axios from "axios";

const users = await axios.get("http://localhost:4000/users");

const user = await axios.get("http://localhost:4000/users/1");

const createUser = await axios.post("http://localhost:4000/users", {
  name: "John Doe",
});

console.log("users:", JSON.stringify(users.data, null, 2));
console.log("user:", JSON.stringify(user.data, null, 2));
console.log("createUser:", JSON.stringify(createUser.data, null, 2));
