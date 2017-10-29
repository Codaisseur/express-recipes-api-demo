const router = require('express').Router()
const { User } = require('../models')

router.post('/users', (req, res, next) => {
  User.register(new User({name: req.body.name, email: req.body.email}), req.body.password, (err, user) => {
    if (err) { return next(err) }

    const { name, email, _id, createdAt, updatedAt } = user
    res.status(201).send({ name, email, _id, createdAt, updatedAt })
  })
})

module.exports = router
