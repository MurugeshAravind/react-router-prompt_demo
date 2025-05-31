/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { fetchCartData, fetchProductData } from '../common/api/api';
import { CARTS_API, PRODUCTS_API } from '../Utilties/appUtils';

// Use Bun's mock() for function mocks
let mockAxios: any;

beforeEach(() => {
  mockAxios = {
    get: mock((url: string) =>
      Promise.resolve({
        data: url,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }),
    ),
  };
});

describe('fetchCartData', () => {
  it('calls axios with provided cartId', async () => {
    const result = await fetchCartData(5, mockAxios);
    expect(mockAxios.get).toHaveBeenCalledWith(`${CARTS_API}5`);
    expect(result.data).toBe(`${CARTS_API}5`);
  });

  it('defaults to id 2 if cartId is falsy', async () => {
    const result = await fetchCartData(0, mockAxios);
    expect(mockAxios.get).toHaveBeenCalledWith(`${CARTS_API}2`);
    expect(result.data).toBe(`${CARTS_API}2`);
  });
});

describe('fetchProductData', () => {
  it('calls axios with provided productId', async () => {
    const result = await fetchProductData(7, mockAxios);
    expect(mockAxios.get).toHaveBeenCalledWith(`${PRODUCTS_API}7`);
    expect(result.data).toBe(`${PRODUCTS_API}7`);
  });
});
