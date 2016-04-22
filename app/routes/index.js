var Yelp = require('node-yelp');

var sharedResults;

module.exports = function(app, passport) {

    app.use(function(req, res, next) {
        res.locals.login = req.isAuthenticated();
        next();
    });

    app.get('/', function(req, res) {
        if (sharedResults) {
            res.render('index', { displayResults: true, results: sharedResults, user: req.user });
        } else {
            res.render('index.ejs', { displayResults: false, user: req.user });
        }
    });

    app.post('/', function(req, res) {
        console.log('req.body', req.body);

        var yelp = new Yelp.createClient({
            oauth: {
                consumer_key: process.env.CONSUMER_KEY,
                consumer_secret: process.env.CONSUMER_SECRET,
                token: process.env.TOKEN,
                token_secret: process.env.TOKEN_SECRET
            }
        });

        yelp.search({ term: 'bar', location: req.body.location })
                .then(function(data) {
                    sharedResults = data;
                    console.log('post / req.user', req.user);
                    res.render('index.ejs', {results: data, displayResults: true, user: req.user } );
                })
                .catch(function(err) {
                    console.log({error: err});
                });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res) {
        console.log('req.user', req.user);
        res.render('index.ejs', { results: sharedResults, displayResults: true, user: req.user });
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