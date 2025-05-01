import express from 'express'
import mongoose from 'mongoose'
import  userRouter  from './routers/userRouter'
import { seedInitialProduts } from './services/productServices'
import routerProduct from './routers/productRouter'

const app = express()
const port = 3001

app.use(express.json())

mongoose.connect('mongodb://localhost:27017/ecommerce')
.then(() => console.log('Mongo Connected!'))
.catch((error) => console.log('Failed to Connect!' , error))


seedInitialProduts()

app.use("/user" , userRouter)
app.use("/product" , routerProduct)



app.listen(port , () => {
    console.log(`Server is running at http://localhost:${port}`);
})