const moment = require('moment');

module.exports = function profiler(str) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  console.log(`${moment().format()} - ${str}`);
};
