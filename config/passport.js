var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Users = mongoose.model('Users');

module.exports.init = function(){
	passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password'
	},function(email, password, done) {
        console.log('password.local.find:',email);
	    Users.findOne({ email: email }, function (err, user) {
        console.log('password.local.find:',user,err);

	      if (err) { 
	      	return done(err); 
	      }
	      if (!user) { 
	      	return done(null, false); 
	      }
	      if (!user.verifyPassword(password)) { 
	      	return done(null, false); 
	      }
	      return done(null, user);
	    });
	  }
	));

	passport.serializeUser(function(user, done) {
      console.log('password.local.serializeUser:',user);
	  done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
        console.log('password.local.deserializeUser:',id);

	    Users.findById(id, function (err, user) {
	      done(err, user);
	    });
	});
}

