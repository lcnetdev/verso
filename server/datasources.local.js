// configure storage based on environment variables
'use strict';

if (process.env.DB_STORAGE === 'file') {
  module.exports.db = {
    connector: 'memory',
    file: process.env.DB_FILE,
  };
}

if (process.env.DB_STORAGE === 'mongodb') {
  module.exports.db = {
    connector: 'mongodb',
    url: process.env.DB_URL,
  };
}
