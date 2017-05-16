const moment = require('moment');

module.exports = function profiler(str) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  // eslint-disable-next-line
  console.log(`${moment().format()} - ${str}`);
};
