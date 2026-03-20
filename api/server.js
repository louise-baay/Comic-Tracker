const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// double checking first / route
app.get("/", (req, res) => {
    res.send("ComicShelf API is running!");
})


// GET /api
app.get("/api",);

// POST /api
app.post("/api",);

// PUT /api
app.put("/api",);

// DELETE /api
app.delete("/api",);

// GET /api/id
app.get("/api/:id",);

// PUT /api/id
app.put("/api/:id",);

// DELETE /api/id
app.delete("/api/:id",);


app.listen(PORT, () => {
    console.log(`ComicShelf REST API running at https://localhost:${PORT}/api`);
})