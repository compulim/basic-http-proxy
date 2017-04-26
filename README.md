# basic-http-proxy

[![npm version](https://badge.fury.io/js/basic-http-proxy.svg)](https://npmjs.com/package/basic-http-proxy) [![Node.js dependencies](https://david-dm.org/compulim/basic-http-proxy.svg)](https://david-dm.org/compulim/basic-http-proxy) [![npm downloads](https://img.shields.io/npm/dm/basic-http-proxy.svg)](https://npmjs.com/package/basic-http-proxy)

Basic HTTP/S proxy that simply works. Support both HTTP and HTTPS.

## Installation

Type `npm install basic-http-proxy -g` to install.

## How to use

There are few ways to use the proxy:

* Thru command-line interface
* Thru another Node.js program

### Running it with command-line interface

Type `proxy` and it will start listening to port `8080`.

To configure it to run under port `8888`, set environment variable `PORT` to 8888.

### Running it in Node.js

You can also run the proxy inside another Node.js program.

```js
require('basic-http-proxy')({
  port: 8080
});
```

## Configuration

To configure the behavior of the proxy, you can either specify in environment variable, or thru JSON object.

| Env var name | JSON name | Description                    | Default |
| ------------ | --------- | ------------------------------ | ------- |
| `PORT`       | `port`    | Port the server will listen to | `8080`  |

## Roadmap

Check out [this list](https://github.com/compulim/basic-http-proxy/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement) for planned features.

## Contributions

Like us? [Star](https://github.com/compulim/basic-http-proxy/stargazers) us.

Found a bug? File us an [issue](https://github.com/compulim/basic-http-proxy/issues).
