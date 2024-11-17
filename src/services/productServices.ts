import { productModel } from "../models/productModel"


export const getAllProduct = async () => {
    return await productModel.find()
}

export const seedInitialProduts = async () => {
    const products = [
        {title: "Dell Laptop" , image: "https://i5.walmartimages.com/asr/3a0b16b3-88f9-4797-a546-8a7a5f3d15cc.9cd02e837eeb8ced4ef44bdac35a84e9.jpeg" , price: 15000 , stoke: 10}
    ]

    const exsitingProduct = await getAllProduct()

    if(exsitingProduct.length === 0){
        return productModel.insertMany(products)
    }
}