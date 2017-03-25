var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  pinyin = require('pinyin'),
  slug = require('slug'),
  user = require('./user'),
  Post = mongoose.model('Post');
  Category = mongoose.model('Category');

module.exports = function (app) {
  app.use('/admin/category', router);
};

router.get('/',user.requireLogin , function (req, res, next) {
  res.render('admin/category/index', {
      pretty:true
    });
});

router.get('/add',user.requireLogin , function (req, res, next) {
  res.render('admin/category/add', {
      action:"/admin/category/add",
      pretty:true
    });
});
router.post('/add',user.requireLogin , function (req, res, next) {
  req.checkBody('name','分类标题不能为空').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    console.log("errors")
    return res.render('admin/category/add',{
      errors:errors,
      name:req.body.name
    })
  }
  var name = req.body.name
  var py = pinyin(name,{
      style:pinyin.STYLE_NORMAL,
      heteronym: false
    }).map(function(item){
      return item[0];
    }).join(" ");
    var category = new Category({
      name:name,
      slug:slug(py),
      create:new Date()
    })
    category.save(function(err,category){
      if(err) {
        console.log('category/add error:',err);
        req.flash('error','分类保存失败');
        res.redirect('/admin/category/add');
      }else{
        req.flash('info','分类保存成功');
        res.redirect('/admin/category');
      }
    })
});

router.get('/edit/:id',user.requireLogin , function (req, res, next) {
  if(!req.params.id){
    return next(new Error("你传入的id不对"))
  }
  Category.findOne({_id:req.params.id})
      .exec(function(err,category){
        if(err){
          return next(err);
        }
        res.render('admin/category/add', {
          category: category,
          action:"/admin/category/edit/" + category._id,
          pretty:true
        });
      })
});

router.post('/edit/:id',user.requireLogin , function (req, res, next) {
   Category.findOne({_id:req.params.id}).exec(function(err,category){
     if(err){
         return next(new Error("你传入的id不对"))
     }else{
      var py = pinyin(req.body.name,{
      style:pinyin.STYLE_NORMAL,
      heteronym: false
    }).map(function(item){
      return item[0];
    }).join(" ");
        category.name = req.body.name;
        category.slug = slug(py);
        category.save(function(err,category){
          if(err) {
            console.log('category/add error:',err);
            req.flash('error','分类修改失败');
            res.redirect('/admin/category/edit' + req.params.id);
          }else{
            req.flash('info','分类修改成功');
            res.redirect('/admin/category');
          }
        })

     }
   })
});

router.get('/delete/:id',user.requireLogin , function (req, res, next) {
   if(!req.params.id){
     return next(new Error("no post id provided"))
  }
  Category.remove({_id: req.params.id},function(err,rowsRemoved){
    if(err){
      next(err)
    }
    if(rowsRemoved){
      req.flash('success','文章删除成功');
    }else{
      req.flash('success','文章删除失败');
    }
    res.redirect("/admin/category")
  })
});