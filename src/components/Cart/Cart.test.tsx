import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import Cart from "./Cart";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Navigation } from "../common/Navigation";
import { fetchCartData, fetchProductData } from "../common/api/api";

jest.mock("../common/api/api", () => ({
  fetchCartData: jest.fn(),
  fetchProductData: jest.fn(),
}));

const router = createMemoryRouter([
  {
    path: "/",
    element: (
      <>
        <Navigation />
        <Cart />
      </>
    ),
  },
  {
    path: "/cart/:id",
    element: (
      <>
        <Navigation />
        <Cart />
      </>
    ),
  },
  {
    path: "*",
    element: <p>Page Not found</p>,
  },
]);

const mockCartData = {
  id: 2,
  userId: 1,
  date: "2020-01-02T00:00:00.000Z",
  products: [
    {
      productId: 2,
      quantity: 4,
    },
    {
      productId: 1,
      quantity: 10,
    },
    {
      productId: 5,
      quantity: 2,
    },
  ],
  __v: 0,
};
const mockProductData = {
  id: 1,
  title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  price: 109.95,
  description:
    "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  rating: {
    rate: 3.9,
    count: 120,
  },
};

const mockCartAPI = async (data: Record<string, unknown>, status: number) =>
  (fetchCartData as jest.Mock).mockResolvedValue({
    data,
    status,
  });
const mockProductAPI = async (data: Record<string, unknown>, status: number) =>
  (fetchProductData as jest.Mock).mockResolvedValue({
    data,
    status,
  });

describe("Cart component tests", () => {
  beforeEach(async () => {
    act(() => {
      mockCartAPI(mockCartData, 200);
      mockProductAPI(mockProductData, 200);
    });
    jest.useFakeTimers();
  });
  it("should render the Cart component + detect input field", async () => {
    // Check if the Cart component is rendered
    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          /Type something here and click on browser back button/i
        )
      ).toBeDefined();
    });
  });
  it("mocking the product data", async () => {
    // Check if the Cart component is rendered
    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });
    await waitFor(() => {
      expect(
        screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i)
      ).toBeDefined();
    });
  });
  it("mocking the click on cart link + mocking confirm click on dialog", async () => {
    // Check if the Cart component is rendered
    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });
    await waitFor(() => {
      const inputBox = screen.getByRole("textbox");
      expect(inputBox).toBeDefined();
      fireEvent.input(inputBox, { target: { value: "test" } });
    });
    await waitFor(() => {
      const cartLink = screen.getByText(/Cart/i);
      expect(cartLink).toBeDefined();
      fireEvent.click(cartLink);
    });
    await waitFor(() => {
      const dialogBox = screen.getByRole("dialog");
      expect(dialogBox).toBeDefined();
      const header = screen.getByText(
        /Are you sure you want to leave this page/i
      );
      expect(header).toBeDefined();
      const cancelButton = screen.getByText(/Cancel/i);
      expect(cancelButton).toBeDefined();
      const confirmButton = screen.getByText(/Ok/i);
      expect(confirmButton).toBeDefined();
      fireEvent.click(confirmButton);
    });
  });
  it("mocking the click on cart link + mocking cancel click on dialog", async () => {
    // Check if the Cart component is rendered
    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });
    await waitFor(() => {
      const inputBox = screen.getByRole("textbox");
      expect(inputBox).toBeDefined();
      fireEvent.input(inputBox, { target: { value: "test" } });
    });
    await waitFor(() => {
      const cartLink = screen.getByText(/Cart/i);
      expect(cartLink).toBeDefined();
      fireEvent.click(cartLink);
    });
    await waitFor(() => {
      const dialogBox = screen.getByRole("dialog");
      expect(dialogBox).toBeDefined();
      const header = screen.getByText(
        /Are you sure you want to leave this page/i
      );
      expect(header).toBeDefined();
      const cancelButton = screen.getByText(/Cancel/i);
      expect(cancelButton).toBeDefined();
      fireEvent.click(cancelButton);
    });
  });
  it("should handle beforeunload event", async () => {
    const addEventListenerMock = jest.spyOn(window, "addEventListener");
    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });
    await waitFor(() => {
      const inputBox = screen.getByRole("textbox");
      expect(inputBox).toBeDefined();
      fireEvent.input(inputBox, { target: { value: "test" } });
    });
    const beforeUnloadEvent = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(beforeUnloadEvent);
    expect(addEventListenerMock).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    addEventListenerMock.mockRestore();
  });
});
describe("Cart component tests with product api having status as 500", () => {
  beforeEach(async () => {
    await waitFor(() => {
      mockCartAPI(mockCartData, 200);
      mockProductAPI(mockProductData, 500);
    });
    jest.useFakeTimers();
  });
  it("should render the Cart component + detect input field", async () => {
    // Check if the Cart component is rendered
    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });
  });
});
describe("Cart component tests with cart api having status as 500", () => {
  beforeEach(async () => {
    await waitFor(() => {
      mockCartAPI(mockCartData, 500);
      mockProductAPI(mockProductData, 500);
    });
    jest.useFakeTimers();
  });
  it("should render the Cart component + detect input field", async () => {
    // Check if the Cart component is rendered
    await waitFor(() => {
      render(<RouterProvider router={router} />);
    });
  });
});
