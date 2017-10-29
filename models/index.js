const mongoose = require('../config/database.js')
const recipeSchema = require('./recipe')

module.exports = {
  Recipe: mongoose.model('recipes', recipeSchema),
}
