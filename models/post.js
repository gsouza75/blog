var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  id: Schema.Types.ObjectId,
  title:  String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

postSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj._id;
  return obj;
};

postSchema.pre('save', function (next) {
  this.set({ id: this.get('_id') });
  next();
});

module.exports = mongoose.model('Post', postSchema);
