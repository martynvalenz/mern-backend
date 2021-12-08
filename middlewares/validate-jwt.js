const {response, request} = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');

const validateJWT = async (req = request,res = response, next) => {
  const token = req.header('token');

  if(!token){
    return res.status(401).json({
      msg:'No token in request'
    });k
  }

  try {
    const {uid} = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(uid);
    const checkToken = await Token.findOne({userId:user.id});

    if(!checkToken){
      return res.status(401).json({
        msg:'The token is not valid or not in our database',
      });
    }

    if(token !== checkToken.token){
      return res.status(401).json({
        msg:'Not valid token',
      });
    }

    if(!user){
      return res.status(401).json({
        msg:'No valid token -  the user is not in our database',
      });
    }

    req.body.uid = uid;
    next();

  } catch (error) {
    console.log(error); 
    return res.status(401).json({
      msg:'Token no válido',
      resetUser:true
    });
  }
}

module.exports = {
  validateJWT
}