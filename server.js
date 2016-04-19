'use strict';

/**
 * setup server
 */
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./app/config/database.js');
require('dotenv').load();

/**
 * get environment variables
 */
var port = process.env.PORT || 3000;
var dbURI = process.env.MONGOLAB_URI || process.env.MONGODB_URI || configDB.url;


/**
 * connect to mongo database
 */
mongoose.connect(dbURI);
mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open to ' + dbURI);

    /**
     * configure server
     */
    var app = express();
    require('./app/config/passport')(passport);

    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use('/public', express.static('public'));
    app.set('view engine', 'ejs');

    /**
     * passport configuration
     */
    app.use(session({
                        secret: 'fccvotingappsecret',
                        resave: false,
                        saveUninitialized: true
                    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    require('./app/routes/index.js')(app, passport);

    /**
     * start server
     */
    app.listen(port, function() {
        console.log('Server listening on port ' + port + '...');
    });

});