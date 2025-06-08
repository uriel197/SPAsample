const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const indexPath = path.join(__dirname, "public", "index.html");
app.use((req, res) => {
  res.sendFile(indexPath);
});

app.listen(5500, () => console.log("Server on http://localhost:5500"));
