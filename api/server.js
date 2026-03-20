const express = require("express");
const cors = require("cors");
const controller = require("./controller.js");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// double checking first / route
app.get("/", (req, res) => {
    res.send("ComicShelf API is running!");
})


// GET /api
app.get("/api", controller.getAllComics);

// POST /api
app.post("/api", controller.createComic);

// PUT /api
app.put("/api", controller.replaceCollection);

// DELETE /api
app.delete("/api", controller.deleteAllComics);

// GET /api/id
app.get("/api/:id", controller.getComicById);

// PUT /api/id
app.put("/api/:id", controller.updateComicById);

// DELETE /api/id
app.delete("/api/:id", controller.deleteComicById);


app.listen(PORT, () => {
    console.log(`ComicShelf REST API running at https://localhost:${PORT}/api`);
})