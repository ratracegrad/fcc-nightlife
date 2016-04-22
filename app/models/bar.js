'use strict';

var mongoose = require('mongoose');

var barSchema = mongooseSchema({
                                name:       String,
                                going:      Number
                               });

module.exports = mongoose.model('Bar', barSchema);