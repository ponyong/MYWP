const express = require('express');
const Question = require('../models/question');
const Answer = require('../models/answer');
const catchErrors = require('../lib/async-error');

const router = express.Router();

// 동일한 코드가 users.js에도 있습니다. 이것은 나중에 수정합시다.
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET questions listing. */
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
    ]};
  }
  const questions = await Question.paginate(query, {
    sort: {createdAt: -1},
    populate: 'author',
    page: page, limit: limit
  });
  res.render('questions/index', {questions: questions, term: term, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
  res.render('questions/new', {question: {}});
});

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  res.render('questions/edit', {question: question});
}));

router.get('/:id', catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id).populate('author');
  const answers = await Answer.find({question: question.id}).populate('author');
  question.numReads++;    // TODO: 동일한 사람이 본 경우에 Read가 증가하지 않도록???

  await question.save();
  res.render('questions/show', {question: question, answers: answers});
}));

router.post('/:id', catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    req.flash('danger', 'Not exist question');
    return res.redirect('back');
  }
  question.title = req.body.title;
  question.content = req.body.content;
  question.mainTitle = req.body.mainTitle;
  question.tanker = req.body.tanker;
  question.dealer = req.body.dealer;
  question.buffer = req.body.buffer;
  question.number_input = req.body.number_input;
  question.tags = req.body.tags.split(" ").map(e => e.trim());

  await question.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/questions');
}));

router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Question.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/questions');
}));

router.post('/', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  var question = new Question({
    mainTitle: req.body.mainTitle,
    title: req.body.title,
    author: user._id,
    number_input: req.body.number_input,
    content: req.body.content,
    tanker: req.body.tanker,
    dealer: req.body.dealer,
    buffer: req.body.buffer,
    tags: req.body.tags.split(" ").map(e => e.trim()),
  });
  await question.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/questions');
}));

router.post('/:id/answers', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const question = await Question.findById(req.params.id);

  if (!question) {
    req.flash('danger', 'Not exist question');
    return res.redirect('back');
  }

  var answer = new Answer({
    author: user._id,
    question: question._id,
    content: req.body.content
  });
  await answer.save();
  question.numAnswers++;
  await question.save();

  req.flash('success', 'Successfully answered');
  res.redirect(`/questions/${req.params.id}`);
}));



module.exports = router;
