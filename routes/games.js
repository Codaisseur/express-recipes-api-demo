// routes/games.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Game } = require('../models')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router.get('/games', (req, res, next) => {
    Game.find()
      // Newest games first
      .sort({ createdAt: -1 })
      // Send the data in JSON format
      .then((games) => res.json(games))
      // Throw a 500 error if something goes wrong
      .catch((error) => next(error))
    })
    .get('/games/:id', (req, res, next) => {
      const id = req.params.id

      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .post('/games', authenticate, (req, res, next) => {
      let newGame = req.body
      newGame.authorId = req.account._id

      Game.create(newGame)
        .then((game) => {
          io.emit({
            type: 'CREATE_GAME',
            payload: game
          })
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .put('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const updatedGame = req.body

      Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
        .then((game) => {
          io.emit({
            type: 'UPDATE_GAME',
            payload: game
          })
          res.json(game)
        }))
        .catch((error) => next(error))
    })
    .patch('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const patchForGame = req.body

      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }

          const updatedGame = { ...game, ...patchForGame }

          Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
            .then((game) => {
              io.emit({
                type: 'UPDATE_GAME',
                payload: game
              })
              res.json(game)
            }))
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Game.findByIdAndRemove(id)
        .then(() => {
          io.emit({
            type: 'DELETE_GAME',
            payload: id
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
