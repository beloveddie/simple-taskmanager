const express = require("express");
const router = express.Router();
const path = require("path");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3500;

app.use(express.static(path.join(__dirname, "/public")));

// use CORs (OPEN)
app.use(cors());
// built-in middleware for json
app.use(express.json());

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
