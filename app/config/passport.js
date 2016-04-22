var FacebookStrategy = require('passport-facebook').Strategy;
var User            = require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.facebookId);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
                clientID : process.env.CLIENTID,
                clientSecret : process.env.CLIENTSECRET,
                callbackURL: process.env.CALLBACKURL,
                scope: "email"
            },
            function(token, refreshToken, profile, done) {

                process.nextTick(function() {
                    User.findOne({ 'facebookId' :  profile.id }, function(err, user) {
                        if (err) {
                            return done(err);
                        }

                        if (user) {
                            return done(null, user);
                        } else {;
                            var newUser = new User({
                                        facebookId: profile.id,
                                        token: token,
                                        name: profile.displayName,
                            });
                            newUser.save(function(err) {
                                if (err) {
                                    throw err;
                                }

                                return done(null, newUser);
                            });
                        }

                    });

                });

            }));

};