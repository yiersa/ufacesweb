var AV = require('leanengine');
/**
 * 所有code均使用字符串，不适用数字
 */
const error_1 = '-1';//查询数据出错
const error_2 = '-2';//参数错误
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
  return 'Hello world!';
});

var ArticleList = AV.Object.extend('ArticleList');
var comment = AV.Object.extend('comment');

AV.Cloud.define('getArticleList', function(request) {
    var query = new AV.Query('ArticleList');
    if(request.params.type === 'list') {//列表数据
        query.select(['title', 'content', 'createdAt', 'commentCount', 'label']);
    }
    query.equalTo('state', "1");
    return query.find().then(function(results) {
        var data = {
            'errorCode':'0',
            'data': results
        }
        return data;
    }, function (error) {
        console.error('Failed to create new object, with error message: ' + error.message);
        var data = {
            'errorCode':error_1,
            'message': error.message
        }
        return data;
    });
});
AV.Cloud.define('getComment', function(request) {
    var query = new AV.Query('comment');
    query.equalTo('state', "1");
    if(request.params.articleId) {
        query.equalTo('state', "1");
        return query.find().then(function(results) {
            var data = {
                'errorCode':'0',
                'data': results
            }
            return data;
        }, function (error) {
            console.error('Failed to create new object, with error message: ' + error.message);
            var data = {
                'errorCode':error_1,
                'message': error.message
            }
            return data;
        });
    } else {
        var data = {
            'errorCode':error_2,
            'message': '参数错误'
        }
        return data;
    }
});
AV.Cloud.define('addComment', function(request) {
    var comment1 = new comment();
    var commentData = request.params.comment;
    var type = request.params.actionType;//'1'表示添加   '2'表示更新   '3'表示删除
    if ((type === '1') && commentData) {
        comment1.set('content', '哈哈哈哈了');
        comment1.set('time', new Date());
        comment1.set('userId', '5a4b1311ee920a004f9246ca');
        comment1.set('nickName', '桃小东');
        comment1.set('avatarUrl', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKic4Sia2vW3FdMJH947Q9Ik8g5TaibQxbgtubP9SwssgibLewftpM2M5sDEz91kCswtgCwP9fGyqCCQQ/0');
        comment1.set('articleId', '5a5f6b180b616000426632fe');
        comment1.set('state', '1');
        return comment1.save().then(function (item) {
            console.log('New object created with objectId: ' + item.id);
            var data = {
                'errorCode':'0',
                'data':item
            }
            return data;
        }, function (error) {
            console.error('Failed to create new object, with error message: ' + error.message);
            var data = {
                'errorCode':error_1,
                'message': error.message
            }
            return data;
        });
    } else {
        var data = {
            'errorCode':error_2,
            'message': '参数错误'
        }
        return data;
    }
});

AV.Cloud.define('addArticle', function(request) {
    var article = new ArticleList();
    var articleData = request.params.article;
    var type = request.params.actionType;//'1'表示添加   '2'表示更新   '3'表示删除
    if ((type === '1') && articleData) {
        article.set('title', '我要15点起');
        article.set('content', '明天我要下午3点起');
        article.set('userId', '5a4b1311ee920a004f9246ca');
        article.set('nickName', '桃小东');
        article.set('avatarUrl', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKic4Sia2vW3FdMJH947Q9Ik8g5TaibQxbgtubP9SwssgibLewftpM2M5sDEz91kCswtgCwP9fGyqCCQQ/0');
        article.set('label', '百度');

        article.set('origin', 'https://www.baidu.com/');
        var actual = {
            'content': '早上11点才起',
            'url':'https://www.baidu.com/',
            'time': new Date()
        };
        article.set('actual', actual);
        article.set('state', '1');
        article.set('commentCount', 3);
        return article.save().then(function (item) {
            console.log('New object created with objectId: ' + item.id);
            var data = {
                'errorCode':'0',
                'data':item
            }
            return data;
        }, function (error) {
            console.error('Failed to create new object, with error message: ' + error.message);
            var data = {
                'errorCode':error_1,
                'message': error.message
            }
            return data;
        });
    } else {
        var data = {
            'errorCode':error_2,
            'message': '参数错误'
        }
        return data;
    }
});