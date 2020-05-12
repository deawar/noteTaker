// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on note-data, etc.
// ===============================================================================
let notesJSON = [];
let notesData = require("../db/db");
let notesPath = "../Develop/db/db.json";
const fs = require('fs');
//var waitListData = require("../data/waitinglistData");

// ===============================================================================
// WRITE TO DB
// ===============================================================================

function writeToFile (notesPath, notesJSON) {
     fs.writeFile(notesPath, notesJSON, 'UTF-8', function (err) {
            if (err) return console.log(err);
        
    });
}


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
    // API GET Requests
    // Below code handles when users "visit" a page.
    // ---------------------------------------------------------------------------

    app.get("/api/notes", function (req, res) {
        console.log("Just sent a route to app.get /api/notes");
        //res.writeHead(200, { 'Content-Type': 'application/json' });
        res.json(notesData);
        res.end();
    });

    //   app.get("/api/waitlist", function(req, res) {
    //     res.json(waitListData);
    //   });

    // API POST Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // ...the JSON is pushed to the appropriate JavaScript array
    // (ex. User fills out a note... this data is then sent to the server...
    // Then the server saves the data to the db.json file.)
    // ---------------------------------------------------------------------------

    app.post("/api/notes", function (req, res) {
        // Note the code here. Our "server" will respond to requests and let users know if their note 
        // was saved or not.
        // It will do this by sending out the value "true" have a table
        // req.body is available since we're using the body parsing middleware
        if (req.method === 'POST') {

            let newNote = req.body;
            console.log("Received POST Request in apiRoutes New Note: ", newNote);
            notesData.push(newNote);
            console.log("Line 66 apiRoutes just pushed body onto notesJSON: ",notesData);
            res.json(newNote);
            notesJSON = JSON.stringify(notesData);
            console.log("Line 69 apiRoutes notesJSON Stringified: ",notesJSON);
            console.log("Line 70 apiRoutes notesData: ",notesData);
            writeToFile (notesPath, notesJSON);
            res.on('end', function () {
            })
        }
     
        else {
            res.json(false);
        }
    });

// ---------------------------------------------------------------------------
// I added this below code so you could clear out the table while working with the functionality.
// Don"t worry about it!

app.post("/api/clear", function (req, res) {
    // Empty out the arrays of data
    notesData.length = 0;
    

    res.json({ ok: true });
});
};