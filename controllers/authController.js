const {request, response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Token = require('../models/token');
const { generateJWT } = require('../helpers/jwt-generate');

module.exports = {
  async users(req = request, res = response){
    try {
      const users = await User.find().sort({name:1});

      res.json({
        users
      })
      
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg:'Server error'
      });
    }
  },

  async userById(req = request, res = response){
    const {id} = req.params;
    try {
      const user = await User.findById(id);

      res.json({
        user
      })
      
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg:'Server error'
      });
    }
  },

  async updateUser(req = request, res = response){
    const {name,email,password, uid} = req.body
    const {id} = req.params;
    try {
      const user = await User.findById(id);

      if(!user){
        return res.status(400).json({
          'msg':'The user does not exist'
        });
      }

      if(id !== uid){
        return res.status(400).json({
          'msg':'The user is not allowed to edit other users information'
        });
      }
      if(password){
        // hash password
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password,salt);

        await User.findByIdAndUpdate(id, {
          name,
          email,
          password:hashedPassword
        })
      }
      else{
        await User.findByIdAndUpdate(id, {
          name,
          email
        })
      }

      const updatedUser = await User.findById(id);

      res.json({
        user:updatedUser
      })
      
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg:'Server error'
      });
    }
  },

  async deleteUser(req = request, res = response){
    const {uid} = req.body
    const {id} = req.params;
    try {
      const user = await User.findById(id);

      if(!user){
        return res.status(400).json({
          'msg':'The user does not exist'
        });
      }

      if(id !== uid){
        return res.status(400).json({
          'msg':'The user is not allowed to delete other users account'
        });
      }

      await User.findByIdAndDelete(id);

      res.json({
        success:true
      })
      
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg:'Server error'
      });
    }
  },

  async signUp(req = request, res = response){
    const {username, email, password} = req.body;
    try {
      const checkUser = await User.findOne({email});

      if(checkUser){
        return res.status(400).json({
          'msg':'A user already exists with that email'
        });
      }

      // hash password
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(password,salt);
      
      const user = await User.create({
        name:username,
        email,
        password:hashedPassword
      });

      res.json({
        msg:`Bienvenido/a ${user.name}`,
      });

    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg:'Server error'
      });
    }
  },

  async signIn(req = request, res = response){
    const {email, password} = req.body;
    try {
      const user = await User.findOne({email});

      if(!user){
        return res.status(400).json({
          'msg':'Credentials do not belong to an existing user.'
        });
      }

      // Verify password
      const validPassword = await bcrypt.compareSync(password, user.password);
      if(!validPassword){
        return res.status(400).json({
          msg:'Credentials do not belong to an existing user.'
        });
      }

      await Token.deleteMany({userId:user.id});
      const token = await generateJWT(user.id);
      await Token.create({
        token,
        userId:user.id
      });

      const now = Date.now()
      await User.findByIdAndUpdate(user.id, {
        lastLogin:now
      })

      res.json({
        msg:`Bienvenido/a ${user.name}`,
        token,
        user:{
          id:user.id,
          username:user.name,
          email:user.email
        }
      });

    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg:'Server error'
      });
    }
  },

  async signOut(req = request, res = response){
    const {uid} = req.body;
    const {token} = req.headers;

    try {
      const user = await User.findById(uid);

      if(!user){
        return res.status(400).json({
          'msg':'The user does not exist.'
        });
      }

      await Token.deleteOne({userId:uid,token});

      res.json({
        success:true
      });

    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg:'Server error'
      });
    }
  },

  async refreshToken(req = request, res = response){
    const {uid} = req.body;
    const {token} = req.headers;

    try {
      const user = await User.findById(uid);

      if(!user){
        return res.status(400).json({
          'msg':'The user does not exist.'
        });
      }

      await Token.deleteMany({userId:user.id});

      const newToken = await generateJWT(user.id);
      await Token.create({
        token:newToken,
        userId:user.id
      });

      res.json({
        token:newToken
      });

    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg:'Server error'
      });
    }
  }
}
