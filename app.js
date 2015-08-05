var express = require('express');
var url = require('url'); //解析操作url
var superagent = require('superagent'); //这三个外部依赖不要忘记npm install
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var iconv = require('iconv-lite');//文字转码库
var targetUrl = 'http://news.baidu.com/n?cmd=4&class=nba&tn=rss';
superagent.get(targetUrl)
    .end(function (err, res) {
		   if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var chunks = [];
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });
        res.on('output', function() {
            var decodedBody = iconv.decode(Buffer.concat(chunks), 'gb2312');
            console.log(decodedBody);
        });
         var $ = cheerio.load(res.text,{decodeEntities: false,xmlMode: true});
        // 获取首页所有的链接
         $('item','channel').each(function (idx, element) {
             var $element = $(element);
             var href = url.resolve(targetUrl, $element.find('link').text());
             var title = $element.find('title').text();
             console.log(title);
           topicUrls.push(href);
		 });
		// //第一步：得到一个 eventproxy 的实例
// var ep = new eventproxy();
// //第二步：定义监听事件的回调函数。
// //after方法为重复监听
// //params: eventname(String) 事件名,times(Number) 监听次数, callback 回调函数
// ep.after('topic_html', topicUrls.length, function(topics){
    // // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair
    // //.map
    // topics = topics.map(function(topicPair){
        // //use cheerio
        // var topicUrl = topicPair[0];
        // var topicHtml = topicPair[1];
        // var $ = cheerio.load(topicHtml);
        // return ({
            // title: $('.topic_full_title').text().trim(),
            // href: topicUrl,
            // comment1: $('.reply_content').eq(0).text().trim()
        // });
    // });
    // //outcome
    // console.log('outcome:');
    // console.log(topics);
// });
// //第三步：确定放出事件消息的
// topicUrls.forEach(function (topicUrl) {
    // superagent.get(topicUrl)
        // .end(function (err, res) {
            // console.log('fetch ' + topicUrl + ' successful');
            // ep.emit('topic_html', [topicUrl, res.text]);
        // });
// });
    });
	
	