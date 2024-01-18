const grpc = require("@grpc/grpc-js");

// Fake db
const users = [
  { id: "74d915ca-20c8-4350-b7a5-1787f6e9a92f", name: "John Doe" },
  { id: "a0a8e7a0-0a7a-4a8a-8a0a-8a8a8a8a8a8a", name: "Jane Doe" },
  { id: "a0a8e7a0-0a7a-4a8a-8a0a-8a8a8a8a8a8a", name: "John Smith" },
];

const usersController = {
  GetUsers: (call, callback) => {
    return callback(null, { users });
  },
  GetUser: (call, callback) => {
    const user = users.find((user) => user.id === call.request.id);

    if (!user) {
      return callback(
        { code: grpc.status.NOT_FOUND, details: "User not found" },
        null
      );
    }

    return callback(null, { user });
  },
  CreateUser: (call, callback) => {
    const user = {
      id: users.length + 1,
      name: call.request.name,
    };

    users.push(user);

    return callback(null, { user });
  },
};

module.exports = usersController;
