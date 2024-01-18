const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const usersController = require("./server-controller");

// Load the proto file
const protoPath = __dirname + "/users.proto";

const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const usersProto = grpc.loadPackageDefinition(packageDefinition);

// Create the server
const server = new grpc.Server();

// Implement methods
server.addService(usersProto.UsersService.service, {
  GetUsers: usersController.GetUsers,
  GetUser: usersController.GetUser,
  CreateUser: usersController.CreateUser,
});

// Start the server
server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  () => server.start()
);
