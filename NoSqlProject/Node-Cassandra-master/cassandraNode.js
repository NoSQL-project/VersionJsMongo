const express = require("express");
const mongo = require('mongoose');
const ip = "127.0.0.1:27017";
const space = "rendu_cassandra";
const beautify = require("json-beautify");
const index = require("./public/index.js");
var query = "";

var Mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var http = require('http');
const app = express()
app.set('port', 8080);

var server = http.createServer(app);
app.use(express.static('public'))
server.on('listening', onListening);
server.listen(8081);

app.get('/', (req, res) => {
  res.sendFile('index.html');
})

app.get('/', (req, res) => {
  res.sendFile('admin.html');
})

app.get('/query', (req, res) => {
    //var query2 = donnee();
    //console.log(Name);
    let queryNmbr = req.query.query
    console.log(queryNmbr)
    let query = ""
    switch(queryNmbr) {
      case "1":
        query = "db.companies2.find({})"
        //console.log(query);
        break;
      case "2":
        query = "db.companies2.find({"+ "'name'" + ":'Vidyo'})";
        break;
      case "3":
        query = {name:'Vidyo'};
        break;
      case "4":
        query = "SELECT name FROM companies where twitter_username > 'A' and twitter_username < 'B' ALLOW FILTERING"
        break;
      case "5":
        query = "SELECT name FROM companies WHERE founded_year > 2004 AND total_money_raised = '$39.8M' ALLOW FILTERING"
        break;
    }


  Mongo.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Compagnies");
    //var query = { name: "Vidyo" };
    console.log(query);
    dbo.collection("companies2").find(query).toArray(function(err, result) {
      //db.companies2.find({})
      if (err) throw err;
      //console.log(result);
      res.json(beautify(result,null, 2,80));
      db.close();
    });
  });
})


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
