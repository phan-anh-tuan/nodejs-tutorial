var async = require('async');
var Book = require('../models/book');
var BookInstance = require('../models/bookinstance');
var Author = require('../models/author');
var Genre = require('../models/genre');

exports.index = function(req, res, next) {
    async.parallel({
        book_count: function(callback) { Book.count(callback); },
        book_instance_count: function(callback) { BookInstance.count(callback); },
        book_instance_available_count: function(callback) { BookInstance.count({status:'Available'}, callback);},
        author_count: function(callback) { Author.count(callback); },
        genre_count: function(callback) { Genre.count(callback); } 
    }, function(err, results){
        res.render('index',{title:'Local Library Home', error: err, data: results});
    });
    
};

// Display list of all books
exports.book_list = function(req, res, next) {
    Book.find({},'title author').populate('author').exec(function(err, book_list){
        if (err) { return next(err) ; }
        res.render("book_list",{title: "Book List", book_list:book_list});
    })
};

// Display detail page for a specific book
exports.book_detail = function(req, res, next) {
    async.parallel({
        book: function(callback) {
                Book.findById(req.params.id)
                    .populate('author')
                    .populate('genre')
                    .exec(callback); },
        book_instances: function(callback) {
                            BookInstance.find({'book': req.params.id}).exec(callback);
                        }
    },function(err, results){
        if (err) {return next(err);}
        res.render('book_detail',{title:'Book Detail', book: results.book, book_instances: results.book_instances})
    });
};

// Display book create form on GET
exports.book_create_get = function(req, res, next) {
    async.parallel({
        authors: function(callback){
            Author.find(callback);
        },
        genres: function(callback){
            Genre.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err);}
        res.render('book_form',{ title: 'Create Book', authors: results.authors, genres: results.genres});
    });
};

// Handle book create on POST
exports.book_create_post = function(req, res, next) {
    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('author','Author is required').notEmpty();
    req.checkBody('summary','Summary is required').notEmpty();
    req.checkBody('isbn','ISBN is required').notEmpty();
    
    req.sanitize('title').escape();
    req.sanitize('title').trim();
    req.sanitize('author').escape();
    req.sanitize('author').trim();
    req.sanitize('summary').escape();
    req.sanitize('summary').trim();
    req.sanitize('isbn').escape();
    req.sanitize('isbn').trim();
    req.sanitize('genres').escape();
    
    var errors = req.validationErrors();
    var book = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre:(typeof req.body.genres === 'undefined') ? [] : req.body.genres.split(',')
    });
    console.log('BOOK: ' + book);
    console.log('eFile: ' + req.file.filename);
    
    if (errors) {
       async.parallel({
        authors: function(callback){
            Author.find(callback);
        },
        genres: function(callback){
            Genre.find(callback);
        }
    }, function(err, results) {
        for(i=0; i< results.genres.length; i++)    {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
                results.genres[i].checked='true';
            }
        }
        res.render('book_form',{ title: 'Create Book', book: book, authors: results.authors, genres: results.genres, errors: errors});
    }); 
    } else {
        book.save(function(err){
           if (err) { return next(err);}
           res.redirect(book.url);
        });
    }
};

// Display book delete form on GET
exports.book_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST
exports.book_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET
exports.book_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST
exports.book_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Book update POST');
};