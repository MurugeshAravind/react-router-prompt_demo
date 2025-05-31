import axios from 'axios';
import { CARTS_API, PRODUCTS_API } from '../../Utilties/appUtils';

export const fetchCartData = (cartId: number, axiosInstance = axios) =>
  axiosInstance.get(`${CARTS_API}${cartId || 2}`);
export const fetchProductData = (productId: number, axiosInstance = axios) =>
  axiosInstance.get(`${PRODUCTS_API}${productId}`);
