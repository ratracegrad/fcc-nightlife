var Yelp = require('node-yelp');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs', {yelp: null});
    });

    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
     app.post('/signup', passport.authenticate('local-signup', {
         successRedirect: '/profile',
         failureRedirect: '/signup',
         failureFlash: true
     }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // YELP SEARCH =========================
    // =====================================
    app.post('/yelpsearch', function(req, res) {

        var yelp = new Yelp.createClient({
            oauth: {
                consumer_key: process.env.CONSUMER_KEY,
                consumer_secret: process.env.CONSUMER_SECRET,
                token: process.env.TOKEN,
                token_secret: process.env.TOKEN_SECRET
            }
        });

        yelp.search({ term: 'bar', location: '30306' })
                .then(function(data) {
                    console.log(data.businesses[0]);
                    res.render('results.ejs', {results: data } );
                })
                .catch(function(err) {
                    console.log({error: err});
                });
    });

};

// =====================================
// FUNCTIONS ===========================
// =====================================
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}