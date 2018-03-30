const express = require("express");
const ip = "127.0.0.1:27017";
const path = require('path');
const http = require('http');
const app = express();
const alertt = require('alert-node');

var Mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.set('port', 8080);

var server = http.createServer(app);
app.use(express.static('public'))
server.on('listening', onListening);
server.listen(8081);

app.get('/', (req,res) => {
  res.sendFile("index.html");
})

app.get('/admin', (req, res) => {
  var email = req.param("email");
  var pass = req.param("password");

  if(email == "admin@admin.fr" && pass == "admin"){
    res.sendFile(path.join(__dirname, './public', 'admin.html'));
  }
  else{

    alertt('Wrong password or email');
  }
})

app.get('/adminQuery', (req,res) => {
  var type = req.param("grp1");
  var query = {}
  query = req.param("requete");



  if(type == "find"){
    Mongo.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("Compagnies");
      dbo.collection("companies2").find(JSON.parse(query)).toArray(function(err, result) {
        if (err) throw err;
        var page = MiseEnForme(result);
        res.send(page);
        db.close();
      });
    });
  }
  if(type == "distinct"){
    Mongo.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("Compagnies");
      dbo.collection("companies2").distinct(query, function(err, result) {
        if (err) throw err;

        var page = AffichageDistinct(result,query);

        res.send(page);
        db.close();
      });
    });

  }

  if(type == "aggregate"){
    Mongo.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("Compagnies");
      dbo.collection("companies2").aggregate(JSON.parse(query), function(err, result) {
        if (err) throw err;
        var page = MiseEnForme(result,query);

        res.send(page);
        db.close();
      });
    });
  }

})

app.get('/queryPerso', (req,res) => {
  var name = req.param("name");
  var year = req.param("year");
  var nb_employees = req.param("test");
  var twitter = req.param("twitter1");
  var btn = req.param("bt1");

  switch (btn) {
    case "find":
    if(name.length != 0){
      Mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Compagnies");
        query = {"name":name};
        dbo.collection("companies2").find(query).sort({"name":1}).toArray(function(err, result) {
          if (err) throw err;

          var page = MiseEnForme(result);
          res.send(page);
          db.close();
        });
      });
      break;
    }
    if(twitter.length != 0){
      Mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Compagnies");
        query = {"twitter_username":twitter};
        dbo.collection("companies2").find(query).sort({"twitter_username":1}).toArray(function(err, result) {
          if (err) throw err;

          var page = MiseEnForme(result);
          res.send(page);
          db.close();
        });
      });
      break;
    }
    if(year.length != 0){
      Mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Compagnies");

        query = {"founded_year":year};
        dbo.collection("companies2").find({"founded_year":parseInt(year)}).sort({"name":1}).toArray(function(err, result) {
          if (err) throw err;

          var page = tableauH(result);
          res.send(page);
          db.close();
        });
      });
      break;
    }
    if(nb_employees.length !=0){
      Mongo.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Compagnies");

        query = { "number_of_employees" : { $gt: parseInt(nb_employees)}};
        dbo.collection("companies2").find(query).sort({"name":1}).toArray(function(err, result) {
          if (err) throw err;

          var page = tableauH(result);
          res.send(page);
          db.close();
        });
      });
      break;
    }
  }


  })


  app.get('/query', (req, res) => {
    let queryNmbr = req.query.query
    let query = ""
    var tab =new Array();

    Mongo.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("Compagnies");

      switch(queryNmbr) {
        case "1":
        query = {"founded_year":2005};
        dbo.collection("companies2").find(query).sort({"name":1}).toArray(function(err, result) {
          if (err) throw err;
          var page = tableauH(result);
          res.send(page);
          db.close();
        });

        break;

        case "2":
        query = "twitter_username";
        dbo.collection("companies2").distinct("twitter_username", function(err, docs) {
          if(err) throw err;

          var page = AffichageDistinct(docs);
          res.send(page);
        });
        db.close();
        break;
        case "3":
        query = {name:'Vidyo'};
        dbo.collection("companies2").find(query).toArray(function(err, result) {

          if (err) throw err;

          result.forEach(function(element) {
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
        break;
        case "4":
        dbo.collection("companies2").aggregate([{$match: {"category_code" : "web"}},{$group: { _id: "$name", nbemployees: { $sum: "$number_of_employees" }}},{$sort: {nbemployees: -1}}]).toArray(function(err, result){
          if(err) throw err;

          result.forEach(function(element) {
            tab += "<tr><td>" + element._id + "</td><td>" + element.nbemployees + "</td></tr>"; // <br>
          })


          var nav = '<nav class="nav-extended #ffa000 amber darken-2"><div class="nav-wrapper"><a href="index.html" class="brand-logo">NoSqlProject</a><a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a></div><div class="nav-content"><ul class="tabs tabs-transparent"><li class="tab"><a class="active" href="#test1">User</a></li><li class="tab"><a href="#test2">Admin</a></li></ul></div></nav>'
          var page = '<html><head><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link type="text/css" rel="stylesheet" href="materialize/css/materialize.min.css"  media="screen,projection"/><script src="http://code.jquery.com/jquery-3.3.1.min.js"></script><script type="text/javascript" src="materialize/js/materialize.min.js"></script></script></head><body>' + nav;
          var tableau = page + "<div style='overflow:scroll; border:#000000 1px solid;width75%;height:75%;margin-top:20px;' class='center-align container table-responsive'><table class='#ffb74d orange lighten-2 striped'><th>Compagny Name : </th><th> Number of employees </th>" + tab + "</table></div></body></html>";
          var footer = tableau + '<div style="margin-top:20px;" class="center-align"><a name="" class="#ffa000 amber darken-2 waves-effect waves-light btn" href="index.html">Previous</a></div>'
          res.send(footer);
          db.close();
        })
        break;
        case "5":
        query ={name:'Vidyo'};
        dbo.collection("companies2").aggregate([{$match: {"name": {$ne:null}}},{$group: {"_id":{"name":"$name","total_money_raised":"$total_money_raised"}, "count": {$sum:1}}},{$group: {"_id":"$_id", "avg":{$avg: "count"}}},
        {$sort: {"avg":-1}}]).toArray(function(err, result) {
          if(err) throw err;
          result.forEach(function(element) {
            tab += "<tr><td>" + element._id.name + "</td><td>" + element._id.total_money_raised + "</td><td>" + element.avg + "</td></tr>"; // <br>
          })

          var nav = '<nav class="nav-extended #ffa000 amber darken-2"><div class="nav-wrapper"><a href="index.html" class="brand-logo">NoSqlProject</a><a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a></div><div class="nav-content"><ul class="tabs tabs-transparent"><li class="tab"><a class="active" href="#test1">User</a></li><li class="tab"><a href="#test2">Admin</a></li></ul></div></nav>'
          var page = '<html><head><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link type="text/css" rel="stylesheet" href="materialize/css/materialize.min.css"  media="screen,projection"/><script src="http://code.jquery.com/jquery-3.3.1.min.js"></script><script type="text/javascript" src="materialize/js/materialize.min.js"></script></script></head><body>' + nav;
          var tableau = page + "<div style='overflow:scroll; border:#000000 1px solid;width75%;height:75%;margin-top:20px;' class='center-align container table-responsive'><table class='#ffb74d orange lighten-2 striped'><th>Compagny Name : </th><th> Total Money Raised </th><th> AVG </th>" + tab + "</table></div></body></html>";
          var footer = tableau + '<div style="margin-top:20px;" class="center-align"><a name="" class="#ffa000 amber darken-2 waves-effect waves-light btn" href="index.html">Previous</a></div>'
          res.send(footer);
          db.close();
        });
        break;
      }
    });
  })

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  }

  function MiseEnForme(result){
    var tab =new Array();
    result.forEach(function(element) {
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
    return footer;
  }

  function tableauH(result){
    var tab =new Array();
    result.forEach(function(element) {
      var fundation;
      if(element.founded_month != null && element.founded_year != null){
        fundation = element.founded_month+"/"+element.founded_year;
      }
      else{
        if(element.founded_year == null){
          fundation = " ";
        }
        else{
          fundation = element.founded_year;
        }
      }
      tab += "<tr><td>" + element.name + "</td><td>" + element.category_code + "</td><td>" + element.number_of_employees + "</td><td>" + fundation + "</td></tr>"; // <br>
    })
    var nav = '<nav class="nav-extended #ffa000 amber darken-2"><div class="nav-wrapper"><a href="index.html" class="brand-logo">NoSqlProject</a><a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a></div><div class="nav-content"><ul class="tabs tabs-transparent"><li class="tab"><a class="active" href="#test1">User</a></li><li class="tab"><a href="#test2">Admin</a></li></ul></div></nav>'
    var page = '<html><head><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link type="text/css" rel="stylesheet" href="materialize/css/materialize.min.css"  media="screen,projection"/><script src="http://code.jquery.com/jquery-3.3.1.min.js"></script><script type="text/javascript" src="materialize/js/materialize.min.js"></script></script></head><body>' + nav;
    var tableau = page + "<div style='overflow:scroll; border:#000000 1px solid;width75%;height:75%;margin-top:20px;' class='center-align container table-responsive'><table class='#ffb74d orange lighten-2 striped'><th>Compagny Name : </th><th>Category Code</th><th> Number of Employees </th><th> Fundation</th>" + tab + "</table></div></body></html>";
    var footer = tableau + '<div style="margin-top:20px;" class="center-align"><a name="" class="#ffa000 amber darken-2 waves-effect waves-light btn" href="index.html">Previous</a></div>'
    return footer;
  }

  function AffichageDistinct(result,q){
    var tab =new Array();
    result.forEach(function(element) {
      if(element != null && element.length !=0){
        tab += "<tr><td>" + element + "</td></tr>";
      }
    })
    var nav = '<nav class="nav-extended #ffa000 amber darken-2"><div class="nav-wrapper"><a href="index.html" class="brand-logo">NoSqlProject</a><a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a></div><div class="nav-content"><ul class="tabs tabs-transparent"><li class="tab"><a class="active" href="#test1">User</a></li><li class="tab"><a href="#test2">Admin</a></li></ul></div></nav>'
    var page = '<html><head><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link type="text/css" rel="stylesheet" href="materialize/css/materialize.min.css"  media="screen,projection"/><script src="http://code.jquery.com/jquery-3.3.1.min.js"></script><script type="text/javascript" src="materialize/js/materialize.min.js"></script></script></head><body>' + nav;
    var tableau = page + "<div style='overflow:scroll; border:#000000 1px solid;width75%;height:75%;margin-top:20px;' class='center-align container table-responsive'><table class='#ffb74d orange lighten-2 striped'><th>"+ q +"</th>" + tab + "</table></div></body></html>";
    var footer = tableau + '<div style="margin-top:20px;" class="center-align"><a name="" class="#ffa000 amber darken-2 waves-effect waves-light btn" href="index.html">Previous</a></div>'
    return footer;
  }
