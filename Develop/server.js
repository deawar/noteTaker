// grab the packages we need
const express = require('express');
const app = express();
const chalk = require('chalk');
const log = console.log;
const bodyParser = require('body-parser');
const port = process.env.PORT || 3080;
var proc = require('process');
let PID = proc.pid;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public')); // to use static assets in the "Public" directory


require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


// routes will go here
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });

app.get('/api/notes', function(req, res){
    res.send(req.param.version);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });

// start the server
app.listen(port, function() {
    if (PID){
      log(chalk.greenBright("Server up at PID: " + chalk.blue(PID) + "\nListening at http://localhost: " + chalk.yellow(port)));
      }
});