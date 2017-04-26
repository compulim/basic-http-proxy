'use strict';

function hasContent(req) {
  const {
    'content-length'   : contentLength,
    'transfer-encoding': transferEncoding
  } = req.headers;

  return (
    (contentLength && contentLength !== '0') ||
    (transferEncoding || '').split(',').map(encoding => encoding.trim()).includes('chunked')
  );
}

module.exports = hasContent;
