/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
let api = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=F3ZMNRM2OERUXPX&symbol='
let db

const CONNECTION_STRING = process.env.DB; 
MongoClient.connect(CONNECTION_STRING, function(err, dba) { db = dba});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      search('dev1')
      res.send('Work in Progress')
    });
    
};

let search = key => {
  key = key.toUpperCase()
  db.collection('stock').findOne({'stock': key}, (err, doc) => {
    if (doc == null) {
      
      db.collection('stock').insertOne({'stock': key}, (err, doc) => {
        return doc.ops[0]
      })
    }
  })
  
}

function loadDoc(key) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
       }
    };
    xhttp.open("GET", api+key, true);
    xhttp.send();
}