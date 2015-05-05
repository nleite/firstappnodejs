var mongoose = require('mongoose'), assert = require('assert')
var Schema = mongoose.Schema;
//define a schema
var userSchema = new Schema({ name: String, age: Number})
//create static members
userSchema.statics.findByName = function( name, cb){
    return this.find( {"name": name}, cb);
}
//generate a model
var User = mongoose.model('User', userSchema);
//initiate the new user, validates the given arguments
var u1 = User({name:"Many Delgado", age:14});
//just save it
u1.save(function(err){
    assert.equal(null, err);
});