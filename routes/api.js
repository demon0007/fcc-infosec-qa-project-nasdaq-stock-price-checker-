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
    
      console.log(req.headers['x-forwarded-for'].split(',')[0])
      let stockData = {}
      
      if (Array.isArray(req.query.stock)) {
        let stockArray = []
        if (req.query.stock.length > 2) {
          res.send('Too many stock names in the query')
          return
        }
        req.query.stock.forEach((stock_name, i) => {
          request({
              url: api+stock_name,
              json: true
          }, function (error, response, body) {
              if (!error && response.statusCode === 200) {
                  let stock = { stock: stock_name, price: body['Global Quote']['05. price'], like: 1}
                  let update
                  if ( req.query.hasOwnProperty('like') && req.query.like ) {
                    db.collection('stock').find(
                      {stock: stock.stock,
                       likeIP: req.headers['x-forwarded-for'].split(',')[0]},
                      (err, match) => {
                        console.log(match)
                      }
                    )
                    update = {$set: {price: stock.price}, $inc: {like: +1}}
                  } else {
                    update = {$set: {price: stock.price}, $setOnInsert: {like: 0}}
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
                          stockArray.push({stock: doc.value.stock, price: doc.value.price, rel_likes: doc.value.like})
                          if (stockArray.length == 2) {
                            console.log(stockArray)
                            let rel_likes = (stockArray[0].rel_likes - stockArray[1].rel_likes)
                            rel_likes = (rel_likes<0)?rel_likes*-1:rel_likes
                            stockArray[0].rel_likes = rel_likes
                            stockArray[1].rel_likes = rel_likes
                            res.json({stockData: stockArray})
                          }
                        }
                      }
                    )
              }
          })
        })
        // console.log(stockArray)
        
      } else if (req.query.hasOwnProperty('stock')) {
          request({
            url: api+req.query.stock,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let stock = { stock: req.query.stock, price: body['Global Quote']['05. price'], like: 1}
                let update
                if ( req.query.hasOwnProperty('like') && req.query.like ) {
                  update = {$set: {price: stock.price}, $inc: {like: +1}}
                } else {
                  update = {$set: {price: stock.price}, $setOnInsert: {like: 0}}
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
                        res.json({stockData: {stock: doc.value.stock, price: doc.value.price, like: doc.value.like}})
                      }
                    }
                  )
            }
        })
      } else {
        res.send('No Query Found')
      }
    });
    
};

