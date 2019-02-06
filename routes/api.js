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
let request = require('request')
let api = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=F3ZMNRM2OERUXPX&symbol='
let db

const CONNECTION_STRING = process.env.DB; 
MongoClient.connect(CONNECTION_STRING, function(err, dba) { db = dba});

module.exports = function (app) {
  
  app.route('/api/stock-prices')
  
    .get(function (req, res){
      
    let stockData = {}
      
      if (Array.isArray(req.query.stock)) {
        
      } else {
          request({
            url: api+req.query.stock,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let stock = { stock: req.query.stock, price: body['Global Quote']['05. price'], like: 1}
                let update
                if ( req.query.hasOwnProperty('like') && req.query.like ) {
                  update = {$set: {price: stock.price}, $inc: {like: +1}}
                } else if () {
                  update = {$set: {price: stock.price}, $setOnInsert: {like: }}
                }
                db.collection('stock').findOneAndUpdate(
                    {'stock': stock.stock},
                    update,
                    {upsert: true, returnOriginal: false},
                    (err, doc) => {
                      if (err) {
                        console.log(err)
                        res.send('error')
                      } else {
                        res.json({stockData: doc.value})
                      }
                    }
                  )
            }
        })
      }
      // res.send('Work in Progress')
    });
    
};

