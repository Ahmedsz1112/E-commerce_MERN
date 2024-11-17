import express from 'express'
import mongoose from 'mongoose'
import { router } from './routers/userRouter'

const app = express()
const port = 3001

app.use(express.json())

mongoose.connect('mongodb://localhost:27017/ecommerce')
.then(() => console.log('Mongo Connected!'))
.catch((error) => console.log('Failed to Connect!' , error))


app.use("/user" , router)

app.listen(port , () => {
    console.log(`Server is running at http://localhost:${port}`);
})