import express, { Request } from "express";
import { addItemToCart, clearCart, deleteitemToCart, getActiveCartForUser, updateitemsToCart } from "../services/cartServices";
import validateJWT  from"../middleware/validateJWT";
import { ExtendRequest } from "../types/request";

const router = express.Router();

router.get("/", validateJWT, async (req:ExtendRequest, res) => {
  const userId = req.user._id
  const cart = await getActiveCartForUser({userId});
  res.status(200).send(cart);
});

router.delete("/" ,validateJWT, async(req:ExtendRequest , res) => {
  const userId = req.user._id
  const {data , statusCode} = await clearCart({userId})
  res.status(statusCode).send(data)
})

router.post("/items" , validateJWT , async (req: ExtendRequest,res) => {
    const userId = req.user._id
    const {productId , quantity} = req.body;
    const {data , statusCode} = await addItemToCart({userId , productId , quantity})
    res.status(statusCode).send(data)
})

router.put("/items" , validateJWT , async (req: ExtendRequest , res) => {
  const userId = req.user._id;
  const {productId , quantity} = req.body;
  const {data , statusCode} = await updateitemsToCart({userId , productId, quantity})
  res.status(statusCode).send(data)
})

router.delete("/items/:productId" , validateJWT , async(req: ExtendRequest,  res) => {
  const userId = req.user._id;
  const {productId} = req.params;
  const { data , statusCode} = await deleteitemToCart({userId , productId});
  res.status(statusCode).send(data)
})

export default router;
