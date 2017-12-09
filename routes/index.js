var express = require('express');
var router = express.Router();
var request = require('request');
const Question = require('../models/question');
const catchErrors = require('../lib/async-error');

/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {mainTitle: {'$regex': term, '$options': 'i'}},
      {title: {'$regex': term, '$options': 'i'}},
      {number_input: {'$regex': term, '$options': 'i'}},
      {content: {'$regex': term, '$options': 'i'}},
      {tanker: {'$regex': term, '$options': 'i'}},
      {dealer: {'$regex': term, '$options': 'i'}},
      {buffer: {'$regex': term, '$options': 'i'}},
      {healer: {'$regex': term, '$options': 'i'}},
      {start_time: {'$regex': term, '$options': 'i'}},
      {end_time:{'$regex': term, '$options': 'i'}},
      {vote_tan: {'$regex': term, '$options': 'i'}},
      {vote_deal: {'$regex': term, '$options': 'i'}},
      {vote_buf: {'$regex': term, '$options': 'i'}},
    ]};
  }
  const questions = await Question.paginate({}, {
    sort: {createdAt: -1},
    populate: 'author',
    page: page, limit: limit
  });

  console.log(questions);
  res.render('index',{questions:questions.docs});
}));


module.exports = router;
