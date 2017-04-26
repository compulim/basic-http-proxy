'use strict';

const config      = require('config');
const packageJSON = require('./package.json');

const port = config.get('PORT');

require(`./${ packageJSON.main }`)({
  port
}, () => {
  console.log(`Proxy server now listening to port ${ port }`);
});
