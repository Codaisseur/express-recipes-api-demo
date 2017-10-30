const passportJWT = require('passport-jwt')

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

module.exports = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET || 'verysecret'
}
