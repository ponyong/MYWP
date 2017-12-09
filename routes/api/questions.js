const express = require('express');
const Question = require('../../models/question');
const catchErrors = require('../../lib/async-error');

const router = express.Router();

// Index
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
  res.json({questions: questions.docs, page: questions.page, pages: questions.pages,query: req.query});
}));

// Read
router.get('/:id', catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id).populate('author');
  res.json(question);
}));

// Create
router.post('', catchErrors(async (req, res, next) => {
  var question = new Question({
    title: req.body.title,
    author: req.user._id,
    content: req.body.content,
    tags: req.body.tags.map(e => e.trim()),
  });
  await question.save();
  res.json(question)
}));

// Put
router.put('/:id', catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next({status: 404, msg: 'Not exist question'});
  }
  if (question.author && question.author._id != req.user._id) {
    return next({status: 403, msg: 'Cannot update'});
  }
  question.title = req.body.title;
  question.content = req.body.content;
  question.tags = req.body.tags;
  await question.save();
  res.json(question);
}));

// Delete
router.delete('/:id', catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next({status: 404, msg: 'Not exist question'});
  }
  if (question.author && question.author._id != req.user._id) {
    return next({status: 403, msg: 'Cannot update'});
  }
  await Question.findOneAndRemove({_id: req.params.id});
  res.json({msg: 'deleted'});
}));


module.exports = router;
