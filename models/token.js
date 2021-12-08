const {Schema, model} = require('mongoose');

const tokenSchema = Schema({
  token:{type:String},
  userId:{type:Schema.Types.ObjectId,ref:'User'}
}, {
  timestamps: true
});

tokenSchema.methods.toJSON = function(){
  const {__v, _id, ...data} = this.toObject();
  data.id = _id;
  return data;
}

module.exports = model('Token',tokenSchema,'tokens');