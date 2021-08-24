'use strict';
const pug = require("pug");
const Cookies = require('cookies');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const util = require('./handler-util');
const Post = require('./post');

dayjs.extend(utc);
dayjs.extend(timezone);

const trackingIdKey = 'tracking_id';
let track_id;


const handle = function(req, res) {
  const cookies = new Cookies(req, res);
  addTrackingCookie(cookies);

  switch (req.method) {
    case 'GET':
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      Post.findAll({order:[['id', 'DESC']]}).then((posts) => {
        posts.forEach(post => {
          // 時間の表示変更
          post.formattedCreatedAt = dayjs(post.createdAt)
            .tz('Asia/Tokyo')
            .format('YYYY年MM月DD日 HH時mm分ss秒');
        });
        res.end(pug.renderFile('./views/posts.pug', { posts: posts, user: req.user}));
        console.info(
          `閲覧されました： user: ${req.user},` +
          `trackingId: ${track_id},` +
          `remoteAddress: ${req.socket.remoteAddress},` +
          `user-agent: ${req.headers['user-agent']}`
        );
      });
      break;
    case 'POST':
      // TODO: POST 処理
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        const params = new URLSearchParams(body);
        const content = params.get('content');
        console.info('投稿されました:' + content);

        Post.create({
          content: content,
          trackingCookie: track_id,
          postedBy: req.user
        }).then(() => {
          handleRedirectPosts(req, res);
        });
      })
      break;
    default:
      util.handleBadRequest(req, res);

  }
}

// cookieを付与する関数
const addTrackingCookie = cookies => {
  if( !cookies.get(trackingIdKey)){
    const trackingId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const tomorrow  = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1日後のミリ秒
    cookies.set(trackingIdKey, trackingId, { expires: tomorrow });
  }
    track_id = cookies.get(trackingIdKey);
}

// top page へのリダイレクト処理
const handleRedirectPosts = (req, res) => {
  res.writeHead(302, {
    'Location': '/posts'
  });
  res.end()
}


// 削除機能の実装
const handleDelete = (req, res) => {
  switch (req.method) {
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        const params = new URLSearchParams(body);
        const id = params.get('id');
        Post.findByPk(id).then((content) => {
          if(req.user === content.postedBy || req.user === 'admin'){
            content.destroy().then(() => {
              handleRedirectPosts(req, res);
              console.info(`削除されました： ${content.content} by ${req.user}`);
            });
          }
        });
      });
      break;
    default:
      util.handleBadRequest(req, res);
  }
}



module.exports = {
  handle,
  handleDelete
};
