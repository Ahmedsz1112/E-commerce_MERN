import { cartModel, ICart, ICartItem } from "../models/cartModel";
import { productModel } from "../models/productModel";

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  await cart.save();
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
}

export const getActiveCartForUser = async ({
  userId,
}: GetActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};

export const clearCart = async({userId}: {userId: string}) => {
  const cart = await getActiveCartForUser({userId})

  cart.items = []
  cart.totalAmount = 0

  const updateCart = await cart.save()
  return {data: updateCart , statusCode: 200}
}


interface AddIemsToCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddIemsToCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (existsInCart) {
    return { data: "Items Already exists in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product Not Found", statusCode: 400 };
  }

  if (product.stoke < quantity) {
    return { data: "low stock for item", statusCode: 400 };
  }

  cart.items.push({ product: productId, unitPrice: product.price, quantity });

  cart.totalAmount += product.price * quantity;

  const updateCart = await cart.save();

  return { data: updateCart, statusCode: 200 };
};

interface UpdateIemsToCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const updateitemsToCart = async({productId , quantity , userId}: UpdateIemsToCart) =>{
  const cart = await getActiveCartForUser({userId});

   const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if(!existsInCart){
    return {data: "Item dose not exist in cart" , statusCode: 400}
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product Not Found", statusCode: 400 };
  }

  if (product.stoke < quantity) {
    return { data: "low stock for item", statusCode: 400 };
  }

  existsInCart.quantity = quantity;

  const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);

  let total = calculateCartItems({cartItems: otherCartItems})

  total += existsInCart.quantity * existsInCart.unitPrice;
  cart.totalAmount = total
  const updatedCart = await cart.save()

  return {data: updatedCart , statusCode: 200}
}

interface DeleteIemsToCart {
  productId: any;
  userId: string;
}

export const deleteitemToCart = async({productId , userId}:DeleteIemsToCart) => {
   const cart = await getActiveCartForUser({userId});

   const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if(!existsInCart){
    return {data: "Item dose not exist in cart" , statusCode: 400}
  }

  const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);

  let total = calculateCartItems({cartItems: otherCartItems})

  cart.items = otherCartItems
  cart.totalAmount = total

   const updatedCart = await cart.save()

  return {data: updatedCart , statusCode: 200}
}


const calculateCartItems = ({cartItems}: {cartItems: ICartItem[]}) => {
  let total = cartItems.reduce((sum , product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  },0)

  return total
}

