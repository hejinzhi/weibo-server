var mongoose = require('mongoose');
var WeiboSchema = new mongoose.Schema({
    name: String,
    sendTime: String,
    sendMachine: String,
    headFace: String,
    desc: String,
    descImage: Array,
    resendNum: Number,
    commentNum: Number,
    thumbNum: Number,
    userID: String
});


WeiboSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort({ sendTime:-1 }).exec(cb);
    },
    findByName: function(name, cb) {
        return this.find({
            name: name
        }).sort({ sendTime:-1 }).exec(cb);
    },
    findByUserID: function(userID, cb) {
        return this.find({
            userID: userID
        }).sort({ sendTime:-1 }).exec(cb);
    },
    deleteByID: function(id, cb) {
        // return this.remove({ _id: 'ObjectId(' + '\"' + id + '\")' }).exec(cb);
        return this.remove({
            _id: id
        }).exec(cb);
    },
    // addNewWeibo: function(cb) {
    //     return this.collection.insert({
    //         "name": "锦___",
    //         "sendTime": "1分钟前",
    //         "sendMachine": "Iphone 6S",
    //         "headFace": "img/ben.png",
    //         "resendNum": 0,
    //         "descImage": [
    //             "img/ben.png",
    //             "img/max.png",
    //             "img/mike.png"
    //         ],
    //         "commentNum": 0,
    //         "thumbNum": 0,
    //         "desc": "国际网红土拨鼠，找到了原版视频",
    //         "userID": "57c9103687600b902567e06e"
    //     }).exec(cb);
    // }
}


// WeiboSchema.methods.fetch = function (cb) {
//     return this.model('Weibo').find({}, cb);
// }

// WeiboSchema.methods.findByName = function (name,cb) {
//     return this.model('Weibo').find({name:name}, cb);
// }

module.exports = WeiboSchema;
