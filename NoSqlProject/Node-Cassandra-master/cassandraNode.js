const express = require("express");
const ip = "127.0.0.1:27017";
//const space = "rendu_cassandra";
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

app.get('/admin', (req, res) => {
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
        query = ""
        break;
      case "5":
        query =""
        break;
    }

var tab =new Array();
  Mongo.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Compagnies");
    //var query = { name: "Vidyo" };
    if(queryNmbr == "4"){
      dbo.collection("companies2").aggregate([{$match :{"founded_year":2005}},{$project :{"name":1}}]).toArray(function(err, result){
        if(err) throw err;
        //res.json(result);
        //console.log(result);

        result.forEach(function(element) {
          //tab.push(element.name + "<br>");
          tab += "<tr><td>" + element.name + "</td><td>" + element._id + "</td></tr>"; // <br>
        })
        var nav = '<nav class="nav-extended #ffa000 amber darken-2"><div class="nav-wrapper"><a href="index.html" class="brand-logo">NoSqlProject</a><a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a></div><div class="nav-content"><ul class="tabs tabs-transparent"><li class="tab"><a class="active" href="#test1">User</a></li><li class="tab"><a href="#test2">Admin</a></li></ul></div></nav>'
        var page = '<html><head><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link type="text/css" rel="stylesheet" href="materialize/css/materialize.min.css"  media="screen,projection"/><script src="http://code.jquery.com/jquery-3.3.1.min.js"></script><script type="text/javascript" src="materialize/js/materialize.min.js"></script></script></head><body>' + nav;
        var tableau = page + "<div style='overflow:scroll; border:#000000 1px solid;width75%;height:75%' class='center-align container table-responsive'><table class='#ffb74d orange lighten-2 striped'><th>Compagny Name : </th><th> ID </th>" + tab + "</table></div></body></html>";
        var footer = tableau + '<div class="center-align"><a name="" class="#ffa000 amber darken-2 waves-effect waves-light btn" href="index.html">Previous</a></div>'
        //<div style="overflow:scroll; border:#000000 1px solid;width50%;height:50%">
        //console.log(tab);
        res.send(footer);
        db.close();
      })
    }
    else{
      console.log(query);
      dbo.collection("companies2").find(query).toArray(function(err, result) {
        //db.companies2.find({})
        if (err) throw err;
        //console.log(result);
        res.json(JSON5.stringify(result));
        db.close();
      });

    }
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
