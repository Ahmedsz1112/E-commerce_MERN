import express from 'express'
import { getAllProduct } from '../services/productServices'

const router = express.Router()

router.get('/' , async (req,res) => {
    const products = await getAllProduct()
    res.status(200).send(products)
})

export default router;