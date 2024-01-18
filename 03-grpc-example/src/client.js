const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

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

const client = new usersProto.UsersService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

client.GetUser(
  { id: "74d915ca-20c8-4350-b7a5-1787f6e9a92f" },
  (err, response) => {
    console.log("GetUser response: ", response);
  }
);

client.CreateUser({ name: "John Doe" }, (err, response) => {
  console.log("CreateUser response: ", response);
});

client.GetUsers({}, (err, response) => {
  console.log("GetUsers response: ", response);
});

client.GetUser(
  { id: "3388f5a0-0a7a-4a8a-8a0a-8a8a8a8a8a8a" },
  (err, response) => {
    console.log("GetUser error: ", err.details);
  }
);
