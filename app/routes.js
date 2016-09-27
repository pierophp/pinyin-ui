module.exports = function (app, passport) {
    
    app.use('/auth', require('./controllers/AuthController'));
    app.use('/files', isAuthenticated, require('./controllers/FilesController'));
    app.use('/segmentation', require('./controllers/SegmentationController'));
    app.use('/unihan', isAuthenticated, require('./controllers/UnihanController'));
    app.use('/cccedict', require('./controllers/CcCeDictController'));

    function isAuthenticated(req, res, next) {

        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }

}