const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./comics.db");

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
    });
});

function getAllComics(callback){
    db.all(`SELECT * FROM comics ORDER BY id ASC`, [], callback);
}

function createComic(comic, callback){
    const sql = `
    INSERT INTO comics
    (seriesTitle, issueNumber, publisher, condtions, storageLocation, estimatedValue, lentOut)
    VALUES(?, ?, ?, ?, ?, ?, ?)`;

    db.run(
        sql,
        [
            comic.seriesTitle,
            comic.issueNumber,
            comic.publisher,
            comic.conditions,
            comic.storagelocation,
            comic.estimatedValue,
            comic.lentOut
        ],
        function (err) {
            if (err) {
                return callback(err);
            }
        }
    );
}

function replaceCollection(comics, callback){
    db.serialize(() => {
        db.run(`DELETE FROM comics`, (deleteErr) => {
            if (deleteErr){
                return callback(deleteErr);
            }

            if (comics.length === 0){
                return callback(null);
            }

            const stmt = db.prepare(`
                INSERT INTO comics
                (seriesTitle, issueNumber, publisher, condtions, storageLocation, estimatedValue, lentOut)
                VALUES(?, ?, ?, ?, ?, ?, ?)`);

            for (const comic of comics){
                stmt.run(
                    comic.seriesTitle,
                    comic.issueNumber,
                    comic.publisher,
                    comic.conditions,
                    comic.storagelocation,
                    comic.estimatedValue,
                    comic.lentOut
                );
            }

            stmt.finalize((finalizeErr) => {
                if (finalizeErr) {
                    return callback(finalizeErr);
                }

                callback(null);
            });
        });
    });
}

function deleteAllComics(callback){
    db.run(`DELETE FROM comics`, [], function (err){
        if(err){
            return callback(err);
        }

        callback(null);
    });
}