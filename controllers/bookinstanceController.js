var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

// Display list of all BookInstances
exports.bookinstance_list = function(req, res, next) {
    BookInstance.find().populate('book').exec(function(err, results){
        if (err) {return next(err);}
        res.render('bookinstance_list',{title: 'Book Instance List', bookinstance_list:results});
    });
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
    Book.find({}, 'title', function(err, results) {
        if (err) { return next(err);}
        res.render('bookinstance_form',{ title: 'Create Book Instance', books: results});    
    })
};

// Handle BookInstance create on POST
exports.bookinstance_create_post = function(req, res, next) {
    //validate data
    req.checkBody('book','Book is required').notEmpty();
    req.checkBody('imprint','Imprint is required').notEmpty();
    req.checkBody('due_back','Due date is required').notEmpty();
    req.checkBody('due_back','Invalid date').isDate();
    req.checkBody('status','Status is required').notEmpty();
    //sanitize data
    req.sanitize('book').escape();
    req.sanitize('book').trim();
    req.sanitize('imprint').escape();
    req.sanitize('imprint').trim();
    req.sanitize('due_back').toDate();
    req.sanitize('status').escape();
    req.sanitize('status').trim();
    
    var errors = req.validationErrors();
    //create bookinstance
    var bookinstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back
    });
    //save
     if (errors) {
        Book.find({},'title', function(err,results){
            if (err) {next(err); return;};
       /*     console.log('Book Instance ' + JSON.stringify(bookinstance));*/
            res.render('bookinstance_form',{title:'Create Book Instance', errors: errors, book_instance: bookinstance, books: results});
            return;    
        }) 
     } else {
        bookinstance.save(function(err){
             if (err) { next(err); return;}
             res.redirect(bookinstance.url);
        })
     };
};

function isBookInstanceAvailable(id,callback) {
    BookInstance.findById(id).populate('book').exec(function(err, bookinstance){
        if (err) { callback(err,false); return;}
        if (!bookinstance || bookinstance.status != 'Available') { 
            callback(null, { available:false, instance: bookinstance})
        } else {
            callback(null, { available:true, instance: bookinstance})
        }
    });
}
// Display BookInstance delete form on GET
// url /bookinstance/:id/delete
exports.bookinstance_delete_get = function(req, res, next) {
    isBookInstanceAvailable(req.params.id,function(err, result){
        if (err) { next(err); return;}
        if (!result.available) {
            res.render('bookinstance_delete', {title: 'Delete Book Instance', errors: [{msg: 'Instance is not available'}]});
        } else {
            res.render('bookinstance_delete', {title: 'Delete Book Instance', book_instance: result.instance});
        }
    })
};

// Handle BookInstance delete on POST
// url /bookinstance/:id/delete
exports.bookinstance_delete_post = function(req, res, next) {
    //validate
    isBookInstanceAvailable(req.params.id, function(err, results){
        if (err) {next(err); return;}
        if (!results.available) {
            if (results.instance) {
                res.render('bookinstance_delete', {title: 'Delete Book Instance', errors: [{msg: 'Instance is not available'}]});
            } else {
                res.redirect('/catalog/bookinstances');
            }
        } else {
            BookInstance.findByIdAndRemove(req.params.id,function(err, results){
                if (err) { next(err); return; }
                res.redirect('/catalog/bookinstances');
            })
        }
    });
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST
exports.bookinstance_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};