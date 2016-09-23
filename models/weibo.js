var mongoose = require('mongoose');
var WeiboSchema = require('../schemas/weibo.js');
var Weibo = mongoose.model('Weibo', WeiboSchema);

module.exports = Weibo;