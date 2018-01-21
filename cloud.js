var AV = require('leanengine');
/**
 * 所有code均使用字符串，不适用数字
 */
const error_1 = '-1';//查询数据出错
const error_2 = '-2';//参数错误
const error_data = {
    'errorCode':error_2,
    'message': '参数错误'
}
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
  return 'Hello world!';
});




AV.Cloud.define('getArticleList', function(request) {
    var query = new AV.Query('ArticleList');
    if(request.params.type === 'list') {//列表数据
        query.select(['title', 'content', 'createdAt', 'commentCount', 'label', 'nickName']);
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

        return error_data;
    }
});
AV.Cloud.define('addComment', function(request) {

    var commentData = request.params.comment;
    var type = request.params.actionType;//'1'表示添加   '2'表示更新   '3'表示删除

    if(!type) {
        return error_data;
    }
    if(type === '3') {//删除
        if(!commentData) {
            return error_data;
        }
        if((!commentData.objectId)) {
            return error_data;
        }
        var commentTemp = AV.Object.createWithoutData('comment', commentData.objectId);
        return commentTemp.destroy().then(function (success) {
            console.log(success);
            // 删除成功
            var data = {
                'errorCode':'0',
                'data':success
            }
            return data;
        }, function (error) {
            // 删除失败
            console.error('Failed to create new object, with error message: ' + error.message);
            var data = {
                'errorCode':error_1,
                'message': error.message
            }
            return data;
        });

    } else if(type === '2') {//更新
        if(!commentData) {
            return error_data;
        }
        if((!commentData.content) ||
            (!commentData.objectId)) {
            return error_data;
        }
        var commentTemp = AV.Object.createWithoutData('comment', commentData.objectId);
        commentTemp.set('content', commentData.content);
        return commentTemp.save().then(function (item) {
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
    } else if(type === '1') {//添加
        if(!commentData) {
            return error_data;
        }
        if((!commentData.content) ||
            (!commentData.userId) ||
            (!commentData.nickName) ||
            (!commentData.avatarUrl) ||
            (!commentData.articleId)) {
            return error_data;
        }
        var comment = AV.Object.extend('comment');
        var comment1 = new comment();
        var ArticleListTemp = AV.Object.createWithoutData('ArticleList', commentData.articleId);
        ArticleListTemp.increment('commentCount', 1);
        ArticleListTemp.fetchWhenSave(true);
        comment1.set('content', commentData.content);
        comment1.set('userId', commentData.userId);
        comment1.set('nickName', commentData.nickName);
        comment1.set('avatarUrl', commentData.avatarUrl);
        comment1.set('articleId', commentData.articleId);
        comment1.set('state', '1');
        comment1.set('type', 'comment');

        var objects = [ArticleListTemp,comment1]; // 构建一个本地的 AV.Object 对象数组

        // 批量创建（更新）
        return AV.Object.saveAll(objects).then(function (objects) {
            // 成功
            var commentData = {};
            if(objects && objects.length > 0) {
                for(var i = 0; i < objects.length; i++) {
                    console.log(objects[i].get('type'))
                    if(objects[i].get('type') === 'comment') {
                        commentData = {
                            "content": objects[i].get("content"),
                            "userId": objects[i].get("userId"),
                            "nickName": objects[i].get("nickName"),
                            "avatarUrl": objects[i].get("avatarUrl"),
                            "articleId": objects[i].get("articleId"),
                            "objectId": objects[i].id,
                            "createdAt": objects[i].createdAt,
                            "updatedAt": objects[i].updatedAt
                        };
                    }
                }
            }
            var data = {
                'errorCode': '0',
                'data': commentData
            }
            return data;
        }, function (error) {
            // 异常处理
            console.error('Failed to create new object, with error message: ' + error.message);
            var data = {
                'errorCode':error_1,
                'message': error.message
            }
            return data;
        });
    } else {
        return error_data;
    }
});

AV.Cloud.define('addArticle', function(request) {

    var articleData = request.params.article;
    var type = request.params.actionType;//'1'表示添加   '2'表示更新   '3'表示删除



    if(!type) {
        return error_data;
    }
    if(type === '3') {//删除
        if(!articleData) {
            return error_data;
        }
        if((!articleData.objectId)) {
            return error_data;
        }
        var articleTemp = AV.Object.createWithoutData('ArticleList', articleData.objectId);
        return articleTemp.destroy().then(function (success) {
            console.log(success);
            // 删除成功
            var data = {
                'errorCode':'0',
                'data':success
            }
            return data;
        }, function (error) {
            // 删除失败
            console.error('Failed to create new object, with error message: ' + error.message);
            var data = {
                'errorCode':error_1,
                'message': error.message
            }
            return data;
        });

    } else if(type === '2') {//更新
        if(!articleData) {
            return error_data;
        }
        if((!articleData.actual) ||
            (!articleData.objectId)) {
            return error_data;
        }
        var articleTemp = AV.Object.createWithoutData('ArticleList', articleData.objectId);
        articleTemp.set('actual', articleData.actual);
        return articleTemp.save().then(function (item) {
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
    } else if(type === '1') {//添加
        if(!articleData) {
            return error_data;
        }
        if((!articleData.title) ||
            (!articleData.content) ||
            (!articleData.userId) ||
            (!articleData.nickName) ||
            (!articleData.avatarUrl) ||
            (!articleData.label) ||
            (!articleData.origin)) {
            return error_data;
        }
        var ArticleList = AV.Object.extend('ArticleList');
        var article = new ArticleList();


        article.set('title', articleData.title);
        article.set('content', articleData.content);
        article.set('userId', articleData.userId);
        article.set('nickName', articleData.nickName);
        article.set('avatarUrl', articleData.avatarUrl);
        article.set('label', articleData.label);
        article.set('origin', articleData.origin);
        article.set('state', '1');
        article.set('commentCount', 0);
        return article.save().then(function (item) {
            console.log('New object created with objectId: ' + item.id);
            var articleTemp = {
                "title": item.get("title"),
                "content": item.get("content"),
                "userId": item.get("userId"),
                "nickName": item.get("nickName"),
                "avatarUrl": item.get("avatarUrl"),
                "label": item.get("label"),
                "origin": item.get("origin"),
                "commentCount": 0,
                "objectId": item.id,
                "createdAt": item.createdAt,
                "updatedAt": item.updatedAt
            };
            var data = {
                'errorCode':'0',
                'data':articleTemp
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
        return error_data;
    }
});