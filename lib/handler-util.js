'use strict';
const fs = require('fs');

const handleLogout = (req, res) => {
  res.writeHead(401, {'Content-Type': 'text/html; charset=utf-8'});
  res.end(
    '<DOCTYPE html><html lang="ja"><body><h1>ログアウトしました</h1><a href ="/posts">ログイン</a></body></html>'
  );
}

const handleNotFound = (req, res) => {
  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.write('ページがみつかりません');
  res.write('<p><a href="/posts">秘密の匿名掲示板</a></p>');
}

const  handleBadRequest = (req, res) => {
  res.writeHead(404, {
    'Content-Type': 'text/plane; charset=utf-8'
  });
  res.end('未対応のメソッドです');
}

const handleFavicon = (req, res) => {
  res.writeHead(200, {'Content-Type': 'image/vnd.microsoft.icon'});
  const favicon = fs.readFileSync('./favicon.ico');
  res.end(favicon);
}

module.exports = {
  handleLogout,
  handleNotFound,
  handleBadRequest,
  handleFavicon
};
