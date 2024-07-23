import bodyParser from "body-parser";
import express from "express";

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.use((req, res) => res.status(404).json({ message: "404 - Not Found" }));

app.listen(5000, () => console.log("Server has started on port 5000"));
