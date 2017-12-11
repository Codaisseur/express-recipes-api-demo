
  // routes/games.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Game } = require('../models')
const utils = require('../lib/utils')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/games', (req, res, next) => {
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
      const newGame = {
        userId: req.account._id,
        players: [{
          userId: req.account._id,
          pairs: []
        }],
        tiles: [null,null,null,null,null,null,null,null,null]
      }

      Game.create(newGame)
        .then((game) => {
          io.emit('action', {
            type: 'GAME_CREATED',
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
          io.emit('action', {
            type: 'GAME_UPDATED',
            payload: game
          })
          res.json(game)
        })
        .catch((error) => next(error))
    })


    .patch('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const patchForGame = req.body
      const changeIndex = req.body.ticTacToeIndex

      Game.findById(id)
        .then((game) => {

          if (!game) { return next() }

          // selecting x and o
          const newTiles = game.tiles;
          const turnNo = newTiles.filter(t => (t !== null)).length + 1;
          const takeTurns = turnNo % 2 === 1 ? 'O' : 'X';

          newTiles[changeIndex] = takeTurns;

          //selecting a winner

          function calculateWinner() {
            const newTiles = game.tiles;
            const lines = [
              [newTiles[0],newTiles[1], newTiles[2]],
              [newTiles[3],newTiles[4], newTiles[5]],
              [newTiles[6],newTiles[7], newTiles[8]],
              [newTiles[0],newTiles[3], newTiles[6]],
              [newTiles[1],newTiles[4], newTiles[7]],
              [newTiles[2],newTiles[5], newTiles[8]],
              [newTiles[0],newTiles[4], newTiles[8]],
              [newTiles[2],newTiles[4], newTiles[6]],
            ];
            for (let i = 0; i < lines.length; i++) {
              if ((lines[i][0]) && (lines[i][0]) === (lines[i][1]) && (lines[i][0]) === (lines[i][2])) {
                return lines[i][0];
              }
            }
            return null;
          }

          const test = calculateWinner();
          const newWinner = test

          //updating the database
          const updatedGame = { ...game, tiles: newTiles, winner: newWinner}

          Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
            .then((game) => {

              io.emit('action', {
                type: 'GAME_UPDATED',
                payload: game
              })
              res.json(game)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })


    .delete('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Game.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'GAME_REMOVED',
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
