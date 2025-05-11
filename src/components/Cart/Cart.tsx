import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { PRODUCTS_API, CARTS_API } from '../Utilties/appUtils';
import { useParams } from 'react-router-dom';
import { Products } from '../Products';
import { Prompt } from '../common/Prompt';

export type Data = {
  title: string;
  image: string;
  price: number;
  id: number;
  rating: {
    rate: number;
    count: number;
  };
};

function Cart(): React.JSX.Element {
  const { id } = useParams();
  const [cartData, setCartData] = useState<Data[]>([]);
  const [searchText, setSearchText] = useState('');

  const callAPI = async (cartId = '2') => {
    const cartDataRes = await axios.get(`${CARTS_API}${cartId}`);
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
    callAPI(id);
  }, [id]);
  const handleInputText = (text: string) => {
    setSearchText(text);
  };
  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <Prompt inputText={handleInputText} />
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-10">
          {cartData?.length > 0 && [
            ...new Set(
              cartData
                .filter((item) =>
                  item.title.toLowerCase().includes(searchText.toLowerCase()),
                )
                .map((item, index) => {
                  return <Products key={`${item?.id}_${index}`} {...item} />;
                }),
            ),
          ]}
        </div>
      </div>
    </>
  );
}

export default React.memo(Cart);
