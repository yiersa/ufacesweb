var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
  return 'Hello world!';
});

var ArticleList = AV.Object.extend('ArticleList');

AV.Cloud.define('getArticleList', function(request) {
    var query = new AV.Query('ArticleList');
    if(request.params.type === 'list') {//列表数据
        query.select(['title', 'content', 'createdAt', 'commentCount', 'label']);
    }
    query.equalTo('state', "1");
    return query.find().then(function(results) {

        return results;
    });
});



// // 查询 document 列表
// AV.Cloud.define('getArticleList', function(request) {
//     var query = new AV.Query(ArticleList);
//     // query.equalTo('state',"1");
//     query.find().then(function(results) {
//
//         return results;
//
//
//     }, function(err) {
//         if (err.code === 101) {
//             // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
//             // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
//             return [];
//         } else {
//             next(err);
//         }
//     }).catch(next);
// });
