// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on note-data, etc.
// ===============================================================================

let notesData = require("../db/db");
const fs = require('fs');
//var waitListData = require("../data/waitinglistData");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
    // API GET Requests
    // Below code handles when users "visit" a page.
    // ---------------------------------------------------------------------------

    app.get("/api/notes", function (req, res) {
        console.log("Just sent a route to app.get /api/notes");
        res.json(notesData);
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

            console.log("Received POST Request in apiRoutes");
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            let body = '';
            req.on('data', function (data) {
                body += data;
            });
            res.on('end', function () {

                fs.readFile('../db/db.json', function (err, notesJSON) {
                    if (err) {
                        console.log(err);
                    }
                    let notes = JSON.parse([notesJSON]);
                    let newNotes = JSON.parse(body);
                    notes.note.push(newNotes);
                    notesJSON = JSON.stringify(notes);


                    fs.writeFile('db.json', notesJSON, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                });
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
    tableData.length = 0;
    waitListData.length = 0;

    res.json({ ok: true });
});
};