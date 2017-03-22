// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UsersSchema = new Schema({
  name: { type:String ,required: true },
  email: { type:String ,required: true },
  password: { type:String ,required: true },
  create: { type:Date }
});


mongoose.model('Users', UsersSchema,"users");

