var express = require('express');
var router = express.Router();
var walk = require('walk');

exports.route = function (app) {
    var base = 'views';
    var walker = walk.walk(base, { followLinks: false });

    walker.on('file', function(root, stat, next){
        var fileName = stat.name.split('.')[0];
        var parentGroup = root.match(/views\/(.*)/);
        var parent = '/', path = parent + fileName;
        if(parentGroup && parentGroup.length>0){
            parent += parentGroup[1];
            path = parent + '/' + fileName;
        }
        router.get(path, function(req, res){
            res.render(path.substring(1));
        });
        next();
    });


    app.use('/', router);
}
