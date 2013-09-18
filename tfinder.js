
var jade = require('jade'),
    path = require('path'),
    fs = require('fs');

exports.init = function(app) {
    var _resolvePath = jade.Parser.prototype.resolvePath;
    jade.Parser.prototype.resolvePath = function(template_path, purpose) {
        var paths = app.get('templates') || [];

        for (var i = 0; i < paths.length; ++i) {
            if (this.filename.indexOf(paths[i]) == -1) {
                continue;
            }
            var template_file = path.join(paths[i], template_path + '.jade');
            if (fs.existsSync(template_file)) {
                this.options.basedir = paths[i];
                return _resolvePath.apply(this, [path.join('/', template_path), purpose]);
            }
        }
        this.options.basedir = app.get('default_views');
        return _resolvePath.apply(this, [path.join('/', template_path), purpose]);
    };

    app.addTemplatesPath = function(templates_path) {
        var paths = app.get('templates') || [];
        paths.push(templates_path);
        app.set('templates', paths)
    };
};

exports.renderOverride = function(req, res, next) {
    var app = req.app,
        _render = res.render;

    res.render = function() {
        var paths = app.get('templates') || [],
            template_name = arguments[0] + '.jade',
            template_dir = null;
        paths.push(app.get('default_views'));

        for (var i = 0; i < paths.length; ++i) {
            if (fs.existsSync(path.join(paths[i], template_name))) {
                template_dir = paths[i];
                break
            }
        }

        if (!template_dir) {
            throw Error('Can\'t find template: ' + template_name);
        }
        app.set('views', template_dir);
        return _render.apply(this, arguments);
    };

    next();
};
