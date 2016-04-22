'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
                                    facebookId:     String,
                                    token:          String,
                                    name:           String
                                 });

module.exports = mongoose.model('User', userSchema);