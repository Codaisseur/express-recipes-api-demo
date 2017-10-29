const express = require('express')
const bodyParser = require('body-parser')
const { Recipe } = require('./models')

const port = process.env.PORT || 3030

let app = express()

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .get('/recipes', (req, res) => {
    Recipe.find()
      // Newest recipes first
      .sort({ createdAt: -1 })
      // Send the data in JSON format
      .then((recipes) => res.send(recipes))
      // Throw a 500 error if something goes wrong
      .catch((error) => res.status(500).send({ error }))
  })
  .get('/recipes/:id', (req, res) => {
    const id = req.params.id
    Recipe.findById(id)
      .then((recipe) => res.send(recipe))
      .catch((error) => res.status(422).send({ error }))
  })
  .post('/recipes', (req, res) => {
    const recipe = req.body
    Recipe.create({ recipe })
      .then((recipe) => res.send(recipe))
      .catch((error) => res.status(422).send({ error }))
  })

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
