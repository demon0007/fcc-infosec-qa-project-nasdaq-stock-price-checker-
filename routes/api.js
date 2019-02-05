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
      
    });
    
};

let search(key) 