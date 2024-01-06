import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

//The secret would be stored in .env in non-test environment
const secret = 'secret'
const PORT = 8080
const app = express()
const database = { data: 'Hello World' }

app.use(cors())
app.use(express.json())

//Verify token authenticity
const auth = (req: any, res: any, next: any) => {
  const token = req.body.token

  if (!token) {
    res.sendStatus(401)
  } else {
    jwt.verify(token, secret, function (err: any) {
      if (err) {
        res.sendStatus(401)
      } else {
        next()
      }
    })
  }
}

// Routes
//In lieu of a login, I am creating the token here
app.get('/', (req, res) => {
  let token = jwt.sign({ claims: database, expiresIn: '1hr' }, secret)

  res.json({ data: database, token: token })
})

//This post request only works with the correct token
app.post('/', auth, (req, res) => {
  database.data = req.body.data

  res.sendStatus(200)
})

app.post('/verify', (req, res) => {
  let token = req.body.token
  jwt.verify(token, secret, function (err: any) {
    if (err) {
      res.sendStatus(401)
    } else {
      res.sendStatus(200)
    }
  })
})

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
