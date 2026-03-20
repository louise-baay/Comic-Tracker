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


function replaceCollection(req, res){
    const comics = req.body;

    if(!Array.isArray(comics)){
        return res.status(400).json({ error: "Requests body must be an array" });
    }

    for(const comic of comics){
        if(
            seriesTitle === undefined ||
            issueNumber === undefined ||
            publisher === undefined ||
            condition === undefined ||
            storageLocation === undefined ||
            estimatedValue === undefined ||
            lentOut === undefined
        ) {
            return res.status(400).json({ error: "Each item must contain all fields except id" });
        }
    }

    model.replaceCollection(comics, (err) => {
        if(err){
            return res.status(500).json({ error: err.message });
        }

        res.json({ status: "Collection replaced" });
    });
}

//DELETE /api
function deleteAllComics(req, res){
    model.deleteAllComics((err) => {
        if(err){
            return res.status(500).json({ error: err.message });
        }

        res.json({ status: "Collection delete" });
    });
}

//GET /api/:id
function getComicById(req, res){
    const { id } = req.params;

    model.getComicById(id, (err, row) => {
        if(err){
            return res.status(500).json({ error: err.message });
        }

        if(!row){
            return res.status(404).json({ error: "Record not found"});
        }

        res.json(row);
    });
}

