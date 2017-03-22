var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  Users = mongoose.model('Users'),
  slug = require('slug'),
  Category = mongoose.model('Category');

module.exports = function (app) {
  app.use('/admin/posts', router);
};

router.get('/', function (req, res, next) {
  //sort
  var sortBy = req.query.sortBy ? req.query.sortBy : "created";
  var sortDir = req.query.sortDir ? req.query.sortDir : "desc";
  if(["title","category","author","created"].indexOf(sortBy) === -1){
  	sortBy = "created";
  }
  if(["desc","asc"].indexOf(sortDir) === -1){
  	sortDir = "desc"
  } 
  var sortObj = {};
  sortObj[sortBy] = sortDir;

  //author
  var conditions = {}
  if(req.query.category){
  	conditions.category = req.query.category.trim();
  }else{
  	req.query.category = "";
  }
   if(req.query.author){
  	conditions.author = req.query.author.trim();
  }else{
  	req.query.author = "";
  }
  Users.find({},function(err,authors){
  	if (err) return next(err);
    Post.find(conditions).sort(sortObj).populate("category").populate("author").exec(function (err, posts) {
	    if (err) return next(err);
	    var page = Math.abs(parseInt(req.query.page || 1));
	    var postCount = posts.length;
	    var pageSize = 10;
	    var pages = Math.ceil(postCount / pageSize);
	    if(page > pages){
	      page = pages;
	    }
	    res.render('admin/post/index', {
	      posts: posts.slice( (page-1) * pageSize, page * pageSize),
	      pages:pages,
	      page:page,
	      sortBy:sortBy,
	      authors:authors,
	      sortDir:sortDir,
	      pretty:true,
	      filter:{
	      	category:req.query.category,
	      	author:req.query.author
	      }
	    });
	  });
  })
});


router.get('/add', function (req, res, next) {
  res.render('admin/post/add', {
      pretty:true
    });
});

router.post('/add', function (req, res, next) {
	var title = req.body.title.trim();
	var category = req.body.category.trim();
	var content = req.body.content;

	Users.findOne({},function(err,author){
		if(err){ 
			return next(err) 
		};
		var post = new Post({
			title:title,
			slug:slug(title),
			category:category,
			content:content,
			author:author,
			published:true,
			meta:{ favorite: 0 },
			comment: [],
			created: new Date()
		});
		post.save(function(err,post){
			if(err){
				req.flash('error',"文章保存失败");
				res.redirect("/admin/posts/add");
				return next(err);
			}else{
				req.flash('info',"文章保存成功");
			    res.redirect("/admin/posts");
			}
			
		})
	})
});

router.get('/edit/:id', function (req, res, next) {
});

router.post('/edit/:id', function (req, res, next) {
});

router.get('/delete/:id', function (req, res, next) {
	if(!req.params.id){
	   return next(new Error("no post id provided"))
	}
	Post.remove({_id: req.params.id},function(err,rowsRemoved){
		if(err){
			next(err)
		}
		if(rowsRemoved){
			req.flash('success','文章删除成功');
		}else{
			req.flash('success','文章删除失败');
		}
		res.redirect("/admin/posts")
	})
});