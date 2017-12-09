const express = require('express');
const Question = require('../../models/question');
const Answer = require('../../models/answer');
const LikeLog = require('../../models/like-log');
const catchErrors = require('../../lib/async-error');

const router = express.Router();

router.use(catchErrors(async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next({status: 401, msg: 'Unauthorized'});
  }
}));

router.use('/questions', require('./questions'));

// Like for tank
router.post('/questions/:id/tank/like', catchErrors(async (req, res, next) => {
  console.log("tank")
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next({status: 404, msg: 'Not exist question'});
  }
  var likeLog = await LikeLog.findOne({author: req.user._id, question: question._id, position:"tank"});
  if (!likeLog) {
    question.vote_tan++;
    await Promise.all([
      question.save(),
      LikeLog.create({author: req.user._id, question: question._id, position:"tank"})
    ]);
  }
  return res.json(question);
}));
// Like for tank
router.post('/questions/:id/deal/like', catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next({status: 404, msg: 'Not exist question'});
  }
  var likeLog = await LikeLog.findOne({author: req.user._id, question: question._id, position:"deal"});
  if (!likeLog) {
    question.vote_deal++;
    await Promise.all([
      question.save(),
      LikeLog.create({author: req.user._id, question: question._id, position:"deal"})
    ]);
  }
  return res.json(question);
}));// Like for tank
router.post('/questions/:id/buf/like', catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next({status: 404, msg: 'Not exist question'});
  }
  var likeLog = await LikeLog.findOne({author: req.user._id, question: question._id, position:"buf"});
  if (!likeLog) {
    question.vote_buf++;
    await Promise.all([
      question.save(),
      LikeLog.create({author: req.user._id, question: question._id, position:"buf"})
    ]);
  }
  return res.json(question);
}));
// Like for Answer
router.post('/answers/:id/like', catchErrors(async (req, res, next) => {
  const answer = await Answer.findById(req.params.id);
  answer.numLikes++;
  await answer.save();
  return res.json(answer);
}));

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    msg: err.msg || err
  });
});

module.exports = router;
