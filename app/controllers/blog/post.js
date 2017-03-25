var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post');
  Category = mongoose.model('Category');

module.exports = function (app) {
  app.use('/posts', router);
};

router.get('/', function (req, res, next) {
  Post.find({ published:true }).sort({created:-1}).populate("category").populate("author").exec(function (err, posts) {
    if (err) return next(err);
    var page = Math.abs(parseInt(req.query.page || 1));
    var postCount = posts.length;
    var pageSize = 10;
    var pages = Math.ceil(postCount / pageSize);
    if(page > pages){
      page = pages;
    }
      
    res.render('blog/index', {
      posts: posts.slice( (page-1) * pageSize, page * pageSize),
      pages:pages,
      page:page,
      pretty:true
    });
  });
});

router.get('/category/:name', function (req, res, next) {
  Category.findOne({name:req.params.name}).exec(function(err,category){
    if(err){
      return next(err);
    }
    Post.find({category:category,published:true})
        .sort('created')
        .populate("category")
        .populate("author")
        .exec(function(err,posts){
          if(err){
            return next(err);
          }
          res.render('blog/category', {
            posts: posts,
            category:category,
            pretty:true
          });
        })
  })
});

router.get('/view/:id', function (req, res, next) {
  if(!req.params.id){
    return next(new Error("你传入的id不对"))
  }

  var conditions = {};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id
  }
  Post.findOne(conditions)
      .populate('category')
      .populate('author')
      .exec(function(err,post){
        if(err){
          return next(err);
        }
        res.render('blog/view', {
          post: post,
          pretty:true
        });
      })
});

router.post('/comment/:id', function (req, res, next) {
  if(!req.body.email){
    return next(new Error("传入的email为不能空"))
  }
  if(!req.body.content){
    return next(new Error("传入的内容为不能空"))
  }
  var comment = {
    email:req.body.email,
    content:req.body.content,
    created:new Date()
  }
  var conditions = {};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id
  }
  Post.findOne(conditions).exec(function(err,post){
        if(err){
          return next(err);
        }
        post.comments.unshift(comment);
        post.markModified('comments');
        post.save(function(err,post){
           req.flash("info","评论添加成功")
           res.redirect('/posts/view/' + post._id)
        });
      })
});

router.get('/favourite/:id', function (req, res, next) {
  if(!req.params.id){
    return next(new Error("你传入的id不对"))
  }

  var conditions = {};
  try{
    conditions._id = mongoose.Types.ObjectId(req.params.id);
  } catch(err){
    conditions.slug = req.params.id
  }
  Post.findOne(conditions)
      .populate('category')
      .populate('author')
      .exec(function(err,post){
        if(err){
          return next(err);
        }
        console.log(post)
        post.meta.favourite = post.meta.favourite ? post.meta.favourite + 1:1;
        post.markModified('meta');
        post.save(function(err,post){
          if(err){
            return next(err);
          }
          res.redirect('/posts/view/' + req.params.id)
        })
      });

});


