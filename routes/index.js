var express = require('express');
var router = express.Router();

const mongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017/mydb"


router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// TASK1: Create GET api to fetch authors who have greater than or equal to n awards
router.get('/authorDetails/:awards', function(req, res) {
  var awardd = parseInt(req.params.awards) 
  console.log("awardsss",typeof(awardd))
  mongoClient.connect(url, function(err, db){
    if(err) throw err
     const dbObj  = db.db("mydb")
     dbObj.collection("users").find({ award: { $gte: awardd } }).toArray(function(err, ress){
      if(err) throw err
      console.log("collection created")
      res.json(ress);
      db.close();
     }) 
  })
});

// TASK2: Create GET api to fetch authors who have won award where year >= y
router.get('/awardYear/:year', function(req, res) {
  var years = parseInt(req.params.year) 
  console.log("awardsss",typeof(awardd))
  mongoClient.connect(url, function(err, db){
    if(err) throw err
     const dbObj  = db.db("mydb")
     dbObj.collection("users").find({ year: { $gte: years } }).toArray(function(err, ress){
      if(err) throw err
      console.log("collection created")
      res.json(ress);
      db.close();
     }) 
  })
});

// TASK3: Create GET api to fetch total number of books sold and total profit by each author.
router.get('/authorbook/:author', function(req, res) {
  var authors = req.params.author 
  console.log("awardsss",authors)
  mongoClient.connect(url, function(err, db){
    if(err) throw err
     const dbObj  = db.db("mydb")
     dbObj.collection("users").aggregate([
        {$match : {author: authors}},
        { $unwind: "$books" },
        {$group: {_id: "$books.soldcopies", totalprofit: {$sum:{$multiply:["$books.soldcopies","$books.price"]}}}},
        {$group : {_id: "$books.soldcopies",totalsoldcopies:{"$sum":{"$sum": "$_id"}} ,bothSoldProfit:{"$sum":{ "$sum": "$totalprofit" } }}}
      ]).toArray(function(err, ress){
      if(err) throw err
      console.log("collection created")
      res.json(ress);
      db.close();
     }) 
  })
});

//TASK4: Create GET api which accepts parameter birthDate and totalPrice, where birthDate is
//date string and totalPrice is number.
router.get('/authorDOB/:birthDate', function(req, res) {
  var dob = req.params.birthDate 
  console.log("awardsss",dob)
  mongoClient.connect(url, function(err, db){
    if(err) throw err
     const dbObj  = db.db("mydb")
     dbObj.collection("users").aggregate([
        {$match : {birthDate: {$gte: dob}}},
        { $unwind: "$books" },
        {$group: {_id: "$author", totalprofit: {$sum:{$multiply:["$books.soldcopies","$books.price"]}}}}
      ]).toArray(function(err, ress){
      if(err) throw err
      console.log("collection created")
      res.json(ress);
      db.close();
     }) 
  })
});




module.exports = router;
