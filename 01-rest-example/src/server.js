import express from "express";

const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]);
});

app.get("/users/:id", (req, res) => {
  res.json({ id: req.params.id, name: "John Doe" });
});

app.post("/users", (req, res) => {
  res.json({ name: req.body.name });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
