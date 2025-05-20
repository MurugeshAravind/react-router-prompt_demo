import axios from "axios";
import { CARTS_API, PRODUCTS_API } from "../../Utilties/appUtils";

export const fetchCartData = (cartId: number) => axios.get(`${CARTS_API}${cartId || 2}`);
export const fetchProductData = (productId: number) => axios.get(`${PRODUCTS_API}${productId}`);