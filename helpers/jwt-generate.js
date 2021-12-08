const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = {uid};

    jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn:'48h'
    }, (error, token) => {
      if(error){
        console.log(error);
        reject('No se pudo generar el token');
      }
      else {
        resolve(token);
      }
    })
  })
}

const certifyJWT = async(token = '') => {
  try {
    if(!token){
      return null;
    }
    const {uid} = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(uid);
    if(user){
      if(user.status && user.has_access){
        return user;
      }
      else {
        return null;
      }
    }
    else{
      const customer = await Customer.findById(uid);
      if(customer){
        if(customer.status){
          return customer;
        }
        else{
          return null;
        }
      }
      else{
        return null;
      }
    }
    
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateJWT, certifyJWT
}