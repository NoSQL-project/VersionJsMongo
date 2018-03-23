function query(){

    $.get( "/query", function(data) {
        console.log(data)
        $('.table').text("Data Loaded: " + data);
      });
}


function connect(){
  $.get( "/admin", function() {
      //console.log(data)
      document.location.href="http://manouvellepage.com";
      //$('.table').text("Data Loaded: " + data);
    });

}

var Mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

let Name;

var donnee = function donnee(){
  console.log("ok");
  var MinMoneyRaised = document.requete.min.value;
  var MaxMoneyRaised = document.requete.max.value;
  Name = document.requete.name.value;
  var Email = document.requete.email.value;

  return Name;

}


module.exports =  {
  Name
}
