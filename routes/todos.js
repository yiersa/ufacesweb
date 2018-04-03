'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var ArticleList = AV.Object.extend('ArticleList');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
    res.render('todos', {
        title: '添加'
    });


  // var query = new AV.Query(ArticleList);
  // query.descending('createdAt');
  // query.find().then(function(results) {
  //   res.render('todos', {
  //     title: 'TODO 列表',
  //     todos: results
  //   });
  // }, function(err) {
  //   if (err.code === 101) {
  //     // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
  //     // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
  //     res.render('todos', {
  //       title: 'TODO 列表',
  //       todos: []
  //     });
  //   } else {
  //     next(err);
  //   }
  // }).catch(next);
});

// 新增 Todo 项目
router.post('/', function(req, res, next) {
  var label = req.body.label;
  var origin = req.body.origin;
  var title = req.body.title;
  var content = req.body.content;
  var article = new ArticleList();
    article.set('title', title);
    article.set('content', content);
    article.set('userId', '5a4b1311ee920a004f9246ca');
    article.set('nickName', '桃小冬');
    article.set('avatarUrl', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKic4Sia2vW3FdMJH947Q9Ik8g5TaibQxbgtubP9SwssgibLewftpM2M5sDEz91kCswtgCwP9fGyqCCQQ/0');
    article.set('label', label);
    article.set('origin', origin);
    article.set('state', '1');
    article.set('commentCount', 0);
    console.error('label '+label+' origin '+origin+' title '+title+' content '+content);
    article.save().then(function(todo) {
    res.redirect('/todos');
  }).catch(next);
});



module.exports = router;
