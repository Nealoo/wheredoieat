const express = require('express')
const mongoose = require('mongoose')


// connect
const DB_URL = 'mongodb://127.0.0.1:27017'
mongoose.connect(DB_URL)
mongoose.connection.on('connected',function(){
  console.log('connected!! mongo!!');
})

// model and schema
const Restaurant = mongoose.model('restaurant', new mongoose.Schema({
  index: {type:Number,require:true},
  name: {type:String,require:true},
  winTimes: {type:Number,require:true},
  totalTimes: {type:Number,require:true}
}))

//find findOne create

// Restaurant.create({
//   "index": 0,
//   "name": "KFC",
//   "winTimes": 3,
//   "totalTimes": 10
// },function(err, doc){
//   if (!err){
//     console.log('success create');
//     console.log(doc);
//   }else{
//     console.log('failed create');
//   }
// })

// User.remove({age: 666},function(err, doc){
//   console.log(doc);
// })

// User.update({age: 666}, {'$set': {user: 'new name'}}, function (err, doc) {
//   console.log(doc);
// })

const app = express()

app.get('/',function(req,res){
  res.send('<h1>express started!!</h1>')
})

app.get('/data/update',function(req,res){

  let updateQuery = {}
  if(req.query['winTimes']){
    updateQuery.winTimes = req.query['winTimes']
  }
  if(req.query['totalTimes']){
    updateQuery.totalTimes = req.query['totalTimes']
  }
  if(req.query['name']){
    updateQuery.name = req.query['name']
  }

  if(JSON.stringify(updateQuery) != '{}'){
    Restaurant.update({_id: req.query['id']}, {'$set': updateQuery}, function (err, doc) {
      console.log(req.query['id']);
      console.log(doc);
    })
  }

  res.json({text:'vale'});
})

app.get('/data/get',function(req,res){

  Restaurant.find({}, function(err, doc){
    res.json(doc);
  })
  //res.json({text:'vale'});
})

app.listen(9093,function(){
  console.log('node express');
})
