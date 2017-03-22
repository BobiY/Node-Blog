 
var config = require('./config/config'),
     glob = require('glob'),
     slug = require('slug'),
     loremipsum = require('lorem-ipsum'),
     mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var Post = mongoose.model("Post");
var Users = mongoose.model("Users");
var Category = mongoose.model("Category");
Users.findOne(function(err,user){
	if(err){
		return console.log("cannot find users")
	}
	Category.find(function(err,categories){
		if(err){
			return console.log("cannot find categories")
		}
		categories.forEach(function(category){
			for(var i = 0; i<35 ;i++){
				var title = loremipsum({count :1, units:"sentence"});
				var post = new Post({
					title:title,
					slug:slug(title),
					content:loremipsum({count:30,units:"sentence"}),
					category:category,
					author:user,
					published:true,
					meta:{ favorites: 1 },
					comment:[],
					created:new Date()
				});
				post.save(function(err,post){
					console.log("seved post:",post.slug);
				})
			}
		})
	})
})