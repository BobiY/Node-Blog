// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    md5 = require('md5');


var UsersSchema = new Schema({
  name: { type:String ,required: true },
  email: { type:String ,required: true },
  password: { type:String ,required: true },
  create: { type:Date }
});

UsersSchema.methods.verifyPassword = function (password) {
	var isMacth = md5(password) === this.password;
	console.log('password.local.verifyPassword:', password , this.password , isMacth);
	return isMacth;
}


mongoose.model('Users', UsersSchema,"users");

