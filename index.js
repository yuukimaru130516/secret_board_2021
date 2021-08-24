'use strict';

const http = require('http');
const auth = require('http-auth');
const router = require('./lib/router');

const basic = auth.basic({
	realm: 'Enter username and password.',
	file: './users.htpasswd'
});

const server = http.createServer(basic, (req, res) => {
		router.route(req, res);
	})
	.on('error', (err) => {
		console.error(`serverError: ${err}`);
	})
	.on('clientError', err => {
		console.error(`clientError:${err}`);
	})

const port = process.env.PORT || 8000;

server.listen(port, () => {
	console.info('Listening on ' + port);
	});
