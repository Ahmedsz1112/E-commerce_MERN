import { userModel } from "../models/userModel"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


interface RegisterParams {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export const register = async({firstName , lastName , email , password}: RegisterParams) => {
    const findUser = await userModel.findOne({email})
    if(findUser){
        return {data: 'user already exists!' , statusCode: 400}
    }

    let hashPassword = await bcrypt.hash(password , 10)
    const newUser = new userModel({firstName , lastName , email , password:hashPassword})
    await newUser.save()
    return {data: generatorJWT({firstName , lastName , email}) , statusCode: 200}
}

interface LoginParams {
    email: string,
    password: string
}

export const login = async ({email, password}: LoginParams) => {
    const findUser = await userModel.findOne({email})

    if(!findUser){
        return {data: 'Incorrect email or password' , statusCode: 400}
    }

    const passwordMatch = await bcrypt.compare(password , findUser.password)
    if(passwordMatch){
        return {data: generatorJWT({email , firstName: findUser.firstName , lastName: findUser.lastName}) , statusCode: 200}
    }

    return {data: 'Incorrect email or password' , statusCode: 400}

}

const generatorJWT = (data:any) => {
    return jwt.sign(data , "kr2bRzQmi88OBpXWQUbevGkR7NjPeU8o")
}