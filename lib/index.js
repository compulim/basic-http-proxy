'use strict';

const debug      = require('debug')('server');
const filterMap  = require('./util/filterMap');
const forEachMap = require('./util/forEachMap');
const hasContent = require('./util/hasContent');
const http       = require('http');
const net        = require('net');
const url        = require('url');

const DEFAULT_PORT              = 8080;
const PROXY_HEADER_NAME_PATTERN = /^proxy\-/i;

class Server {
  listen(port = DEFAULT_PORT, callback) {
    if (this.app) {
      throw new Error('already listening');
    }

    const app = this.app = http.createServer((req, res) => {
      pipeHTTP(req, res);
    });

    app.on('connect', (req, socket, head) => {
      pipeHTTPS(req, socket, head);
    });

    app.listen(port, callback);

    return this;
  }

  close(callback) {
    this.app.close(callback);
  }
}

function pipeHTTP(req, res) {
  const { method }         = req;
  const { hostname, port } = url.parse(req.url);
  const headers            = filterMap(req.headers, (_, name) => !PROXY_HEADER_NAME_PATTERN.test(name));

  debug(`got ${ method } request to ${ req.url }`);

  const foreignReq = http.request({
    agent: false,
    headers,
    hostname,
    method,
    port,
  }, foreignRes => {
    forEachMap(foreignRes.headers, (value, name) => {
      res.setHeader(name, value);
    });

    debug(`sending response body`);

    foreignRes.on('end', () => {
      debug(`response body sent`);
    }).pipe(res);
  });

  if (hasContent(req)) {
    debug(`sending request body`);

    req.on('end', () => {
      debug(`request body sent`);
    }).pipe(foreignReq);
  } else {
    foreignReq.end();
  }
}

function pipeHTTPS(req, socket, head) {
  const { hostname, port } = url.parse(`tcp://${ req.url }`);

  debug(`got CONNECT request to ${ req.url }`);

  let dispose = err => {
    socket.end(`HTTP/1.1 500 ${ err ? err.message : 'Teardown' }\r\n\r\n`);
  };

  const foreign = net.connect(port, hostname).once('connect', () => {
    debug(`connected to ${ req.url }`);

    socket.write('HTTP/1.1 200 Connection established\r\n\r\n');
    foreign.write(head);

    foreign.pipe(socket);
    socket.pipe(foreign);

    dispose = err => {
      foreign.unpipe(socket);
      socket.unpipe(foreign);

      if (err) {
        foreign.destroy(err);
        socket.destroy(err);
      } else {
        foreign.end();
        socket.end();
      }
    };
  }).once('error', err => {
    debug(`foreign socket failed due to "${ err.message }"`);
    dispose(err);
  }).once('end', err => {
    debug('foreign socket closed');
    dispose();
  });

  socket.once('error', err => {
    debug(`local socket failed due to "${ err.message }"`);
    dispose(err);
  }).once('end', () => {
    debug('local socket closed');
    dispose();
  });
}

module.exports = function (config, callback) {
  return new Server().listen(config.port, callback);
};
