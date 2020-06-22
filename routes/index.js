var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID
var objectId = new ObjectID();
var _ = require('lodash');
var get = require('lodash.get');

const mongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017/mydb"


router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// TASK1: Create GET api to fetch authors who have greater than or equal to n awards
router.get('/authorDetails/:awards', function(req, res) {
  var awardCount = parseInt(req.params.awards) 
  console.log("awardsss",typeof(awardCount))
  mongoClient.connect(url, function(err, db){
    if(err) throw err
     const dbObj  = db.db("mydb")
     dbObj.collection("authors").aggregate([
        {$unwind: "$_id" },
        {$project:{_id: "$_id",name: "$name",awards:"$awards",totalAward: {$size: {$ifNull:["$awards", []] }}}},
        {$match : {"totalAward": { "$gte": awardCount }}}
      ]).toArray(function(err, ress){
      if(err) throw err
      console.log("collection created")
      res.json(ress);
      db.close();
     }) 
  })
});

// TASK2: Create GET api to fetch authors who have won award where year >= y
router.get('/awardYear/:year',  function(req, res) {
  var years = parseInt(req.params.year) 
  console.log("awardsss",typeof(years))
  mongoClient.connect(url, function(err, db){
    if(err) throw err
     const dbObj  = db.db("mydb")
      dbObj.collection("authors").find({$or : [{"awards.year" :{$gte: years+''} },{"awards.year" :{$gte: Number(years)} }]}).toArray(function(err, ress){
      if(err) throw err
      console.log("collection created")
      res.json(ress);
      db.close();
     }) 
  })
});

// TASK3: Create GET api to fetch total number of books sold and total profit by each author.
router.get('/authorbook/:authorId', function(req, res) {
  var authorIds = req.params.authorId
  console.log("awardsss",authorIds)
  mongoClient.connect(url, function(err, db){
    if(err) throw err
     const dbObj  = db.db("mydb")
     dbObj.collection("books").aggregate([
        {$group: {_id: "$authorId",totalBooksSold:{"$sum":{"$sum": "$sold"}},totalProfit: {$sum:{$multiply:["$sold","$price"]}}}},
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
/*router.get('/authorDOB/:birthDate', function(req, res) {
  var dob = req.params.birthDate 
  console.log("awardsss",dob)
  mongoClient.connect(url, function(err, db){
    if(err) throw err
     const dbObj  = db.db("mydb")
     dbObj.collection("authors").aggregate([
   
      {$match : {birth: {$gte: ISODate("1931-10-12T04:00:00.000Z")}}},
      {
         $lookup:
           {
             from: "books",
             localField: "_id.str",
             foreignField: "authorId.str",
             as: "inventryDocs"
           }
      }
      
    ]).toArray(function(err, ress){
      if(err) throw err
      console.log("collection created")
      res.json(ress);
      db.close();
     }) 
  })
});*/




module.exports = router;
