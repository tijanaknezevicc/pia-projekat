import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routers/user.router'

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/vikendice')
const conn = mongoose.connection
conn.once('open', () => {
    console.log("db ok")
})

const router = express.Router()
router.use('/users', userRouter)

app.use('/', router)
app.listen(4000, ()=>console.log('Express running on port 4000'))


