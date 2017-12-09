const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  mainTitle: {type: String, trim: true, require: true},
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, trim: true, require: true},
  content: {type: String, trim: true},
  tags: {type:[String] , require: true},
  number_input: {type: Number, default: 0},
  SelectFee: {type: Number, default: 0},
  tanker: {type: Number, default: 0},
  dealer: {type: Number, default: 0},
  buffer: {type: Number, default: 0},
  start_time: {type: Date, default: Date.now},
  end_time: {type: Date},
  vote_tan: {type: Number, default: 0},
  vote_deal: {type: Number, default: 0},
  vote_buf: {type: Number, default: 0},
  img: {type: String},
  numLikes: {type: Number, default: 0},
  numAnswers: {type: Number, default: 0},
  numReads: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Question = mongoose.model('Question', schema);

module.exports = Question;
