/* eslint-disable global-require */
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(403);
  return res.send({ error: 'Not logged' });
}

module.exports = function routes(app) {
  app.use('/', require('./controllers/IndexController'));
  app.use('/auth', require('./controllers/AuthController'));
  app.use('/files', isAuthenticated, require('./controllers/FilesController'));
  app.use('/segmentation', require('./controllers/SegmentationController'));
  app.use('/unihan', require('./controllers/UnihanController'));
};
