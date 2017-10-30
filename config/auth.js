// config/auth.js
const passport = require('passport')
const mongoose = require('mongoose')
const passportJWT = require('passport-jwt')
const { User } = require('../models')
const jwtOptions = require('./jwt')

const JwtStrategy = passportJWT.Strategy

const tokenStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  console.log('payload received', jwtPayload)
  const user = User.findById(jwtPayload.id)
    .then((user) => {
      if (user) {
        console.log(user)
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch((err) => done(err, false))
})

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
passport.use(tokenStrategy)

module.exports = passport
