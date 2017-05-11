var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

// Display list of all BookInstances
exports.bookinstance_list = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance list');
};

// Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id).populate('book').exec(function(err,results){
        if (err) {return next(err);}
        res.render('bookinstance_detail', {title:'Book Instance', bookinstance: results})
    });
};

// Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST
exports.bookinstance_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST
exports.bookinstance_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};