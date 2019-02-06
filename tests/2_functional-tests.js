/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let testStock = {stock: 'goog'}

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: testStock.stock})
        .end(function(err, res){
          console.log(res)
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData.stock, testStock.stock)
          
          testStock.price = res.body.stockData.price
          testStock.like = res.body.stockData.like
         
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: testStock.stock})
        .end(function(err, res){
         
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData.stock, testStock.stock)
          assert.equal(res.body.stockData.like, testStock.like+1)
          testStock.like = res.body.stockData.like
         
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: testStock.stock})
        .end(function(err, res){
         
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData.stock, testStock.stock)
          assert.equal(res.body.stockData.like, testStock.like)
          testStock.like = res.body.stockData.like
         
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: [testStock.stock, 'msft']})
        .end(function(err, res){
         
          assert.equal(res.status, 200)
          assert.isArray(res.body.stockData)
          assert.property(res.body.stockData[0], 'stock')
          assert.property(res.body.stockData[1], 'stock')
         
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: [testStock.stock, 'msft'], like:true})
        .end(function(err, res){
         
          assert.equal(res.status, 200)
          assert.isArray(res.body.stockData)
          assert.property(res.body.stockData[0], 'stock')
          assert.property(res.body.stockData[1], 'stock')
          assert.property(res.body.stockData[0], 'rel_likes')
          assert.property(res.body.stockData[1], 'rel_likes')
          
          done();
        });
      });
      
    });

});
