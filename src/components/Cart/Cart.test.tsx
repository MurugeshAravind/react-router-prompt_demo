import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import Cart from "./Cart";
import { Navigation } from "../common/Navigation";
import { fetchCartData, fetchProductData } from "../common/api/api";
import * as reactRouterDom from "react-router-dom";

jest.mock("../common/api/api", () => ({
  fetchCartData: jest.fn(),
  fetchProductData: jest.fn(),
}));


jest.mock('react-router-dom', () => ({
 ...jest.requireActual('react-router-dom'),
 useNavigate: jest.fn(),
}));


const router = reactRouterDom.createMemoryRouter([
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
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
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
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    await waitFor(() => {
      expect(
        screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i)
      ).toBeDefined();
    });
  });
  it("mocking the click on cart link + mocking confirm click on dialog", async () => {
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
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
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
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
      render(<reactRouterDom.RouterProvider router={router} />);
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

  it("should filter products based on search text", async () => {
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    await waitFor(() => {
      const inputBox = screen.getByRole("textbox");
      fireEvent.input(inputBox, { target: { value: "fjallraven" } });
      expect(
        screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i)
      ).toBeDefined();
    });
  });

  it("should not render product if search text does not match", async () => {
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    await waitFor(() => {
      const inputBox = screen.getByRole("textbox");
      fireEvent.input(inputBox, { target: { value: "nonexistent" } });
      expect(
        screen.queryByText(/Fjallraven - Foldsack No. 1 Backpack/i)
      ).toBeNull();
    });
  });

  // Additional tests for increased coverage

  it("should render empty state if cartData is empty", async () => {
    // Mock empty cart data
    act(() => {
      mockCartAPI({ ...mockCartData, products: [] }, 200);
      mockProductAPI({}, 200);
    });
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    // Should not render any product
    expect(
      screen.queryByText(/Fjallraven - Foldsack No. 1 Backpack/i)
    ).toBeNull();
  });
  it("should call redirect to /error if product fetch fails (status !== 200)", async () => {
    const errorProductData = { ...mockProductData };
    act(() => {
      mockCartAPI(mockCartData, 200);
      mockProductAPI(errorProductData, 404);
    });
    const navigateMock = setupNavigateMock();
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    await waitFor(() => {
      // Navigation to /error is expected because the API call failed.
      expect(navigateMock).toHaveBeenCalledWith("/error");
    });
  });
  it("should call redirect to /error if cart fetch fails (status !== 200)", async () => {
    act(() => {
      mockCartAPI(mockCartData, 404);
      mockProductAPI(mockProductData, 200);
    });
    const navigateMock = setupNavigateMock();
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/error");
    });
  });
  it("should not add product if product data is empty", async () => {
    // Simulate product API returning empty object
    act(() => {
      mockCartAPI(mockCartData, 200);
      mockProductAPI({}, 200);
    });
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    // Should not render any product
    expect(
      screen.queryByText(/Fjallraven - Foldsack No. 1 Backpack/i)
    ).toBeNull();
  });
  it("should update searchText state on input", async () => {
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    const inputBox = await screen.findByRole("textbox");
    fireEvent.input(inputBox, { target: { value: "fjall" } });
    // Should still show the product since it matches
    expect(
      screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i)
    ).toBeDefined();
  });
  it("should render multiple products if multiple productData are returned", async () => {
    // Mock multiple products
    const multiCartData = {
      ...mockCartData,
      products: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 1 },
      ],
    };
    const productData2 = {
      id: 2,
      title: "Another Product",
      price: 50,
      description: "desc",
      category: "cat",
      image: "img",
      rating: { rate: 4, count: 10 },
    };
    (fetchCartData as jest.Mock).mockResolvedValue({
      data: multiCartData,
      status: 200,
    });
    (fetchProductData as jest.Mock)
      .mockResolvedValueOnce({ data: mockProductData, status: 200 })
      .mockResolvedValueOnce({ data: productData2, status: 200 });
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    await waitFor(() => {
      expect(
        screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i)
      ).toBeDefined();
      expect(screen.getByText(/Another Product/i)).toBeDefined();
    });
  });
  it("mock duplicate product data", async () => {
    // Add duplicate product to mockCartData
    const duplicateCartData = {
      ...mockCartData,
      products: [...mockCartData.products, { productId: 1, quantity: 1 }],
    };
    act(() => {
      mockCartAPI(duplicateCartData, 200);
      mockProductAPI(mockProductData, 200);
    });
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    await waitFor(() => {
      // Should only render one instance of the product
      expect(
        screen.getAllByText(/Fjallraven - Foldsack No. 1 Backpack/i).length
      ).toBe(1);
    });
  });
});

it("should show loader when isLoading is true", async () => {
  // Force isLoading to true by making fetchCartData unresolved
  (fetchCartData as jest.Mock).mockImplementation(() => new Promise(() => {}));
  await waitFor(() => {
    render(<reactRouterDom.RouterProvider router={router} />);
  });
  expect(screen.getByTestId("tail-spin-loading")).toBeDefined();
});

const setupNavigateMock = () => {
  const navigateMock = jest.fn();
  jest.spyOn(reactRouterDom, "useNavigate").mockReturnValue(navigateMock);
  return navigateMock;
};

describe("Cart component tests with product api having status as 500", () => {
  let navigateMock: jest.Mock;

  beforeEach(async () => {
    navigateMock = setupNavigateMock();
    await waitFor(() => {
      mockCartAPI(mockCartData, 200);
      mockProductAPI(mockProductData, 500);
    });
    jest.useFakeTimers();
  });

  it("should render the Cart component + detect input field", async () => {
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
  });

  it("should redirect to /error if product api fails", async () => {
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/error");
    });
  });
});

describe("Cart component tests with cart api having status as 500", () => {
  let navigateMock: jest.Mock;

  beforeEach(async () => {
    navigateMock = setupNavigateMock();
    await waitFor(() => {
      mockCartAPI(mockCartData, 500);
      mockProductAPI(mockProductData, 500);
    });
    jest.useFakeTimers();
  });

  it("should render the Cart component + detect input field", async () => {
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
  });

  it("should redirect to /error if cart api fails", async () => {
    await waitFor(() => {
      render(<reactRouterDom.RouterProvider router={router} />);
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/error");
    });
  });
});
