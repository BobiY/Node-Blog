var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post');

module.exports = function (app) {
  app.use('/admin', router);
};

router.get('/', function (req, res, next) {
  console.log("sdsdsad")
  res.redirect("/admin/posts")
});