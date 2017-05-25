const moment = require('moment');

module.exports = function profiler(str, forceOnProduction) {
  if (process.env.NODE_ENV === 'production' && forceOnProduction !== true) {
    return;
  }

  const memory = parseFloat(process.memoryUsage().heapUsed / 8 / 1024 / 1024).toFixed(2);
  // eslint-disable-next-line
  console.log(`${moment().format()} - Memory ${memory}MB ${str}`);
};
