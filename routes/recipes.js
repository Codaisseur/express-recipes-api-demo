const router = require('express').Router()
const { Recipe } = require('../models')
const passport = require('../config/auth')

router.get('/recipes', (req, res) => {
    Recipe.find()
      // Newest recipes first
      .sort({ createdAt: -1 })
      // Send the data in JSON format
      .then((recipes) => res.send(recipes))
      // Throw a 500 error if something goes wrong
      .catch((error) => res.status(500).send({ error }))
  })
  .get('/recipes/:id', (req, res, next) => {
    const id = req.params.id
    Recipe.findById(id)
      .then((recipe) => {
        if (!recipe) { return next() }
        res.send(recipe)
      })
      .catch((error) => next(error))
  })
  .post('/recipes', passport.authorize('jwt', { session: false }), (req, res) => {
    let recipe = req.body
    recipe.authorId = req.account._id

    Recipe.create({ recipe })
      .then((recipe) => res.send(recipe))
      .catch((error) => next(error))
  })

module.exports = router
