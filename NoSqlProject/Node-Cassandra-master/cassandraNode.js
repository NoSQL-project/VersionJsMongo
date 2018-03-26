const express = require("express");
const ip = "127.0.0.1:27017";
const path = require('path');


var query = "";

var Mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var http = require('http');
const app = express()
const alertt = require('alert-node');
app.set('port', 8080);

var server = http.createServer(app);
app.use(express.static('public'))
server.on('listening', onListening);
server.listen(8081);

app.get('/', (req, res) => {
  res.sendFile('index.html');
})


app.get('/admin', (req, res) => {
  //var email = req.param("email");
  var email = req.param("email");
  var pass = req.param("password");

  if(email == "admin@admin.fr" && pass == "admin"){
    res.sendFile(path.join(__dirname, './public', 'admin.html'));
  }
  else{

    alertt('Wrong password or email');
  }
})

app.get('/queryPerso',(req, res) => {
  res.send("coucou");
})

app.get('/query', (req, res) => {
    //var query2 = donnee();
    //console.log(Name);
    let queryNmbr = req.query.query
    console.log(queryNmbr)
    let query = ""
    switch(queryNmbr) {
      case "1":
        query = {"founded_year":2005};
        //console.log(query);
        break;
      case "2":
        query = ""
        break;
      case "3":
        query = {name:'Vidyo'};
        break;
      case "4":
        query = ""
        break;
      case "5":
        query ={name:'Vidyo'};
        break;
    }

var tab =new Array();
  Mongo.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Compagnies");
    //var query = { name: "Vidyo" };
    if(queryNmbr == "1"){
      dbo.collection("companies2").find(query).sort({"name":1}).toArray(function(err, result) {

        if (err) throw err;

        console.log(result);
        res.send(result);
    })
    db.close();
  }

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
        var tableau = page + "<div style='overflow:scroll; border:#000000 1px solid;width75%;height:75%;margin-top:20px;' class='center-align container table-responsive'><table class='#ffb74d orange lighten-2 striped'><th>Compagny Name : </th><th> ID </th>" + tab + "</table></div></body></html>";
        var footer = tableau + '<div style="margin-top:20px;" class="center-align"><a name="" class="#ffa000 amber darken-2 waves-effect waves-light btn" href="index.html">Previous</a></div>'
        //<div style="overflow:scroll; border:#000000 1px solid;width50%;height:50%">
        //console.log(tab);
        res.send(footer);
        db.close();
      })
    }
    else if(queryNmbr == "3"){
      console.log(query);
      dbo.collection("companies2").find(query).toArray(function(err, result) {

        if (err) throw err;
        console.log(result);

        result.forEach(function(element) {
          //tab.push(element.name + "<br>");
          tab += "<tr><th>Name</th><td>" + element.name + "</td></tr> <tr><th>ID</th><td>" + element._id + "</td></tr>" +
          "<tr><th>Permalink</th><td>" + element.permalink + "</td></tr><tr><th>CrunchBase</th><td>" + element.crunchbase_url +
          "</td><tr><th>HomePage</th><td>" + element.homepage_url + "</td></tr><tr><th>Twitter Username</th><td>" + element.twitter_username + "</td></tr> "+
          "<tr><th>Category code</th><td>" + element.category_code + "</td></tr> <tr><th>Number of Employees </th><td>" + element.number_of_employees +  "</td></tr>" +
          "<tr><th>Founded Year</th><td>" + element.founded_year + "</td></tr> <tr><th>Founded Month </th><td>" + element.founded_month + "</td></tr>" +
          "<tr><th>Email</th><td>" + element.email_address+ "<tr><th>Phone number </th><td>" + element.phone_number + "</td></tr>"+
          "<tr><th>Description</th><td>" + element.description + "</td></tr><tr><th>Created at</th><td>" + element.created_at + "</td></tr>" +
          "<tr><th>Updated at </th><td>" + element.updated_at + "</td></tr> <tr><th>Overview</th><td>" + element.overview + "</td></tr>" +
          "<tr><th>Total Money Raised</th><td>" + element.total_money_raised + "</td></tr>"; // <br>
        })
        var nav = '<nav class="nav-extended #ffa000 amber darken-2"><div class="nav-wrapper"><a href="index.html" class="brand-logo">NoSqlProject</a><a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a></div><div class="nav-content"><ul class="tabs tabs-transparent"><li class="tab"><a class="active" href="#test1">User</a></li><li class="tab"><a href="#test2">Admin</a></li></ul></div></nav>'
        var page = '<html><head><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link type="text/css" rel="stylesheet" href="materialize/css/materialize.min.css"  media="screen,projection"/><script src="http://code.jquery.com/jquery-3.3.1.min.js"></script><script type="text/javascript" src="materialize/js/materialize.min.js"></script></script></head><body>' + nav;
        var tableau = page + "<div style='overflow:scroll; border:#000000 1px solid;width:90%;height:75%;margin-top:20px;' class='center-align container table-responsive'><table class='#ffb74d orange lighten-2 striped'>" + tab + "</table></div></body></html>";
        var footer = tableau + '<div style="margin-top:20px;" class="center-align"><a name="" class="#ffa000 amber darken-2 waves-effect waves-light btn" href="index.html">Previous</a></div>'


        res.send(footer);
        db.close();
      });
    }
    else if (queryNmbr == "2"){
      dbo.collection("companies2").distinct("twitter_username", function(err, docs) {
        if(err) throw err;
        //console.log(docs);
        res.send(docs);
      });
      db.close();
    }
    else if(queryNmbr=="5"){
      dbo.collection("companies2").find(query).toArray(function(err, result) {
        if(err) throw err;
        console.log(res);
        res.send(result);
      });
      db.close();
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

function drop(){
   $('.dropdown-trigger').dropdown();
}
