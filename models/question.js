const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  mainTitle: {type: String, trim: true, require: true},
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, trim: true, required: true},
  content: {type: String, trim: true, required: true},
  tags: [String],
  number_input: {type: Number, default: 0},
  SelectFee: {type: Number, default: 0},
  tanker: {type: Number, default: 0},
  dealer: {type: Number, default: 0},
  buffer: {type: Number, default: 0},
  healer: {type: Number, default: 0},
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
