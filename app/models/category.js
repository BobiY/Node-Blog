// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: { type:String ,required: true },
  sulg: { type:String ,required: true },
  create: { type:Date }
});


mongoose.model('Category', CategorySchema,"category");

