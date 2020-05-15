// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on note-data, etc.
// ===============================================================================
let notesJSON = [];
const chalk = require('chalk');
const log = console.log;
const bodyParser = require('body-parser');
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
        log(chalk.blue("Just sent a route to app.get /api/notes"));
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

            let newNote = req.body; //Incoming Note
            notesData.push(newNote); //Add new Note to existing Notes
            
            res.json(newNote);
            notesJSON = JSON.stringify(notesData); //stringify new collection of notes
            log(chalk.blue("Line 66 apiRoutes notesJSON Stringified: ",notesJSON));
            
            writeToFile (notesPath, notesJSON); //pass newly built collection of stringified notes to writeFile function
            res.end(true)
        }
        else {
            res.end(false);
        }
    });


    app.delete("/api/notes/:id" , function (req, res) {
        if (req.method === 'DELETE') {
            let noteId = req.params.id;
            log(chalk.greenBright("**Line 81** Trying to see what comes back:",req.params.id));
            log(chalk.yellowBright("**Line 82** Id of note to be deleted is: ", noteId));
            fs.readFile(notesPath, (err, data) => {
                if (err) {
                  console.error(err)
                  return
                }
                notesData = JSON.parse(data);
                log(chalk.red("**Line 89** JSON File pre delete:", notesJSON));
                log(chalk.red("**Line 90** db.json Length:", notesData.length));
              })

            for (let i = 0; i < notesData.length; i++) {
                if (notesData[i].id === noteId) {
                    log(chalk.yellow("---line 95--- ",notesJSON.id))
                    notesData.splice(i, 1);
                    log(chalk.yellow("Line 87 --Item #" + i + " " + notesData[i]))
                }
            }
            log(chalk.red("--Line 99---JSON File post delete:", notesData));
            let deletedNote = true
            notesJSON = JSON.stringify(notesData);
            writeToFile (notesPath, notesJSON); //pass newly built collection of stringified notes to writeFile function
            res.status(200).send(deletedNote)
            res.end(true)
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