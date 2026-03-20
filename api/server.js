const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./comics.db"); //make a db when ran and add it to the /api folder

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS comics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        seriesTITLE TEXT NOT NULL,
        issueNumber INTEGER NOT NULL,
        publisher TEXT NOT NULL,
        condition TEXT NOT NULL,
        storageLocation TEXT NOT NULL,
        estimatedValue REAL NOT NULL,
        lentOut INTEGER NOT NULL DEFAULT 0)`);

    db.get(`SELECT COUNT(*) AS count FROM comics`, (err, row) => {//starter table
        if(err){
            console.error(err.message);
            return;
        }

        if(row.count === 0){
            const stmt = db.prepare(`
                INSERT INTO comics
                (seriesTITLE, issueNumber, publisher, condition, storageLocation, estimatedValue, lentOut)
                VALUES (?, ?, ?, ?, ?, ?, ?)`);

            stmt.run("Absolute Batman", 1, "DC", "NM", "Box 1", 25, 0);
            stmt.run("Absolute Martian Manhunter", 1, "DC", "VG", "Box 1", 6, 0);
            stmt.run("Absolute Wonder Woman", 1, "DC", "NM", "Box 1", 6, 0);

            stmt.finalize();
        }
    })
});

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