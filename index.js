const express = require('express')

const port = process.env.PORT || 3030

let app = express()

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
