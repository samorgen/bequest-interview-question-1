import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

const secret = 'secret'
const PORT = 8080
const app = express()
const database = { data: 'Hello World' }

app.use(cors())
app.use(express.json())

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

app.get('/', (req, res) => {
  let token = jwt.sign({ claims: database, expiresIn: '1hr' }, secret)

  res.json({ data: database, token: token })
})

app.post('/', auth, (req, res) => {
  database.data = req.body.data

  res.send({ data: database.data })
  //res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
