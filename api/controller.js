const model = require("./model.js");

//get /api
function getAllComics(req,res){
    model.getAllComics((err, rows) => {
    if(err) {
        return res.status(500).json(({error: err.message}));
    }

    res.json(rows);
    });
}

// POST/api

function createComic(req, res) {
    const{
        seriesTitle,
        issueNumber,
        publisher,
        condition,
        storageLocation,
        estimatedValue,
        lentOut
    } = req.body;

    if (
        seriesTitle === undefined ||
        issueNumber === undefined ||
        publisher === undefined ||
        condition === undefined ||
        storageLocation === undefined ||
        estimatedValue === undefined ||
        lentOut === undefined
    ) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const comic = {
        seriesTitle,
        issueNumber,
        publisher,
        condition,
        storageLocation,
        estimatedValue,
        lentOut
    };

    comicsModel.createComic(comic, function (err, lastID) {
        if(err){
            return res.status(500).json({ error: err.message });
        }

        res.json({ status: `New record created with id=${lastID}` });
    });
}

