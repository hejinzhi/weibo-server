var mongoose = require('mongoose');
var UserSchema =  new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    headFace: String,
    nickname:String
});


UserSchema.statics={
    fetch:function(cb){
        return this.find({}).exec(cb);
    },
    findByName:function(name,password,cb){
        return this.find({username:name,password:password}).exec(cb);
    }
}


module.exports = UserSchema;