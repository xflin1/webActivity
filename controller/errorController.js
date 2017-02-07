var errorController = function(app){
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res){
        res.status(err.status || 500);
        res.end(err.message);
    });
};

module.exports=errorController;
