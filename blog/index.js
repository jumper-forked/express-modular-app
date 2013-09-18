var init = function(app) {
    require('./urls')(app);
};

module.exports = {
    init: init,
    templates: 'templates'
};
