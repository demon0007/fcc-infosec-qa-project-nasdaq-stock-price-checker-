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
let request = require('ajax-request')
let api = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=F3ZMNRM2OERUXPX&symbol='
let db

const CONNECTION_STRING = process.env.DB; 
MongoClient.connect(CONNECTION_STRING, function(err, dba) { db = dba});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      search('msft', res)
      // res.send('Work in Progress')
    });
    
};

let search = (key, res) => {
  key = key.toUpperCase()
  db.collection('stock').findOne({'stock': key}, (err, doc) => {
    if (doc == null) {
      loadDoc(key, res)
    } else {
      res.json({stockData: doc})
    }
  })
  
}

function loadDoc(key, resp) {
    request({
      url: api+key,
      method: 'GET',
      // data: {
      //   query1: 'value1'
      // }
    }, function(err, res, body) {
        console.log(res)
        // console.log(body)
        resp.send('Log')
    });
}