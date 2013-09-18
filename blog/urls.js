var views = require('./views')

module.exports = function(app) {
    app.get('/', views.index);
};
