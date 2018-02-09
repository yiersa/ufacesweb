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



AV.Cloud.define('getArticle', function(request) {
    var query = new AV.Query('ArticleList');
    query.select(['title', 'origin', 'content', 'createdAt', 'commentCount', 'label', 'nickName','objectId','updatedAt','actual']);
    query.equalTo('state', "1");
    var id = request.params.id;
    if(id) {
        return query.get(id).then(function(result) {
            var data = {
                'errorCode':'0',
                'data': result
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
AV.Cloud.define('getArticleList', function(request) {
    var query = new AV.Query('ArticleList');
    var page = request.params.page;
    var limit = request.params.limit;
    query.select(['title', 'content', 'createdAt', 'commentCount', 'label', 'nickName','objectId']);
    query.equalTo('state', "1");
    if(page < 0) {
        page = 0;
    }
    if(limit < 0) {
        limit = 20;
    }
    query.limit(limit);// 最多返回 limit 条结果
    query.skip(limit * page);// 跳过 limit*page 条结果
    query.descending('createdAt');// 按时间，降序排列
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
//我发布的
AV.Cloud.define('getMineArticleList', function(request) {
    var query = new AV.Query('ArticleList');
    var userId = request.params.userId;
    query.select(['title', 'content', 'createdAt', 'commentCount', 'label', 'nickName','objectId']);
    query.equalTo('state', "1");
    query.equalTo('userId', userId);
    query.descending('createdAt');// 按时间，降序排列
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
//我评论的
AV.Cloud.define('getCommentedArticleList', function(request) {
    var userId = request.params.userId;
    var cql = 'SELECT title,content,createdAt,commentCount,label,nickName,objectId FROM ArticleList WHERE objectId in(SELECT articleId FROM comment WHERE userId=?) ORDER BY createdAt desc';
    var pvalues = [userId];
    return AV.Query.doCloudQuery(cql,pvalues).then(function(results) {
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
    var articleId = request.params.articleId;
    if(articleId) {
        query.equalTo('state', "1");
        query.equalTo('articleId', articleId);
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