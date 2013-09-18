exports.init = function(app) {
    app.get('/users', function(req, res) {
        res.render('users/index')
    });
};

exports.templates = 'templates';
