const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  name:{type:String, required:true},
  email:{type:String, required:true,unique:true},
  password:{type:String, required:true},
  lastLogin:{type:Date},
},  {
  timestamps: true
});

userSchema.methods.toJSON = function(){
  const {__v, _id, password, ...data} = this.toObject();
  data.id = _id;
  return data;
}

module.exports = model('User',userSchema,'users');

