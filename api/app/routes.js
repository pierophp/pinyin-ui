/* eslint-disable global-require */

module.exports = function routes(app) {
  app.use('/', require('./controllers/IndexController'));
  app.use('/auth', require('./controllers/AuthController'));
  app.use('/files', require('./controllers/FilesController'));
  app.use('/segmentation', require('./controllers/SegmentationController'));
  app.use('/jw', require('./controllers/JWController'));
  app.use('/unihan', require('./controllers/UnihanController'));
  app.use('/my-cjk', require('./controllers/MyCjkController'));
};
