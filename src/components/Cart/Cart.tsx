import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { PRODUCTS_API, CARTS_API } from '../Utilties/appUtils';
import { useParams } from 'react-router-dom';
import { Products } from '../Products/Products';

export type Data = {
  title: string;
  image: string;
  price: number;
  id: number;
};

const Cart = (): React.JSX.Element => {
  const { id } = useParams();
  const [cartData, setCartData] = useState<Data[]>([]);
  const callAPI = async () => {
    const cartDataRes = await axios.get(`${CARTS_API}${id ? id : '2'}`);
    const { data: CART_DATA, status }: AxiosResponse = cartDataRes;
    if (status === 200) {
      CART_DATA?.products?.map(async (item: Record<string, unknown>) => {
        const PRODUCTS_DATA = await Promise.all([
          axios.get(`${PRODUCTS_API}${item?.productId}`),
        ]);
        const res = PRODUCTS_DATA[0];
        if (res.status === 200 && Object.keys(res).length > 0) {
          setCartData((prev) => [...prev, res.data]);
        } else {
          throw new Error('error');
        }
      });
    } else {
      throw new Error('error');
    }
  };
  useEffect(() => {
    callAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {cartData?.length > 0 &&
          cartData?.map((x, index) => {
            return <Products key={`${x?.id}_${index}`} {...x} />;
          })}
      </div>
    </div>
  );
};

export default React.memo(Cart);
