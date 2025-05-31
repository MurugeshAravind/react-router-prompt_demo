import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
  cleanup,
} from '@testing-library/react';
import {
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
  mock,
  jest,
  spyOn,
} from 'bun:test';
import { Cart } from '../Cart';
import { Navigation } from '../common/Navigation';
import * as reactRouterDom from 'react-router-dom';

let addEventListenerSpy: jest.Mock;
let removeEventListenerSpy: jest.Mock;

// --- Mock Data ---
const mockCartData = {
  id: 2,
  userId: 1,
  date: '2020-01-02T00:00:00.000Z',
  products: [
    { productId: 2, quantity: 4 },
    { productId: 1, quantity: 10 },
    { productId: 5, quantity: 2 },
  ],
  __v: 0,
};

const mockProductData = {
  id: 1,
  title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
  price: 109.95,
  description: 'Your perfect pack for everyday use and walks in the forest.',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  rating: { rate: 3.9, count: 120 },
};

// --- Centralized Mocks ---
const mocks = {
  navigate: mock(() => {}),
  fetchCart: mock(() => Promise.resolve({ data: mockCartData, status: 200 })),
  fetchProduct: mock(() =>
    Promise.resolve({ data: mockProductData, status: 200 }),
  ),
  blocker: mock(() => ({ state: 'unblocked' })), // Mock blocker
};

// --- Mock Modules ---
mock.module('../common/api/api', () => ({
  fetchCartData: mocks.fetchCart,
  fetchProductData: mocks.fetchProduct,
}));

mock.module('react-router-dom', () => ({
  ...reactRouterDom,
  useNavigate: () => mocks.navigate,
  useParams: () => ({ id: '2' }),
  useBlocker: () => mocks.blocker(), // Mock useBlocker to prevent conflicts
  createMemoryRouter: reactRouterDom.createMemoryRouter,
  RouterProvider: reactRouterDom.RouterProvider,
}));

// --- Helper Functions ---
const createTestRouter = () => {
  return reactRouterDom.createMemoryRouter(
    [
      {
        path: '/react-router-prompt_demo/',
        element: (
          <>
            <Navigation />
            <Cart />
          </>
        ),
      },
      {
        path: '/react-router-prompt_demo/cart/:id',
        element: (
          <>
            <Navigation />
            <Cart />
          </>
        ),
      },
      {
        path: '*',
        element: <p>Page Not found</p>,
      },
    ],
    {
      initialEntries: ['/react-router-prompt_demo/cart/2'], // Start with cart route
    },
  );
};

const renderWithRouter = () => {
  const router = createTestRouter();
  return render(<reactRouterDom.RouterProvider router={router} />);
};

// --- Tests ---
describe('Cart Component - Fixed Router Tests', () => {
  beforeEach(() => {
    // Reset all mocks

    addEventListenerSpy = spyOn(window, 'addEventListener');
    removeEventListenerSpy = spyOn(window, 'removeEventListener');
    Object.values(mocks).forEach((mock) => mock.mockClear?.());
    // Set default implementations
    act(() => {
      mocks.fetchCart.mockResolvedValue({ data: mockCartData, status: 200 });
      mocks.fetchProduct.mockResolvedValue({
        data: mockProductData,
        status: 200,
      });
    });
    mocks.blocker.mockReturnValue({ state: 'unblocked' });
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
    jest.clearAllMocks();
    cleanup();
  });

  describe('Basic Rendering', () => {
    it('should render Cart component with input field', async () => {
      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(
            /Type something here and click on browser back button/i,
          ),
        ).toBeDefined();
      });
    });

    it('should display product data correctly', async () => {
      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i),
        ).toBeDefined();
      });
    });

    it('should show loader when loading', async () => {
      mocks.fetchCart.mockImplementationOnce(() => new Promise(() => {}));

      await act(async () => {
        renderWithRouter();
      });

      expect(screen.getByTestId('tail-spin-loading')).toBeDefined();
    });
  });

  describe('Navigation Blocking', () => {
    it('should handle navigation blocking with dialog', async () => {
      // Mock blocker as blocked when there's input
      mocks.blocker.mockReturnValue({ state: 'blocked' });

      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        const inputBox = screen.getByRole('textbox');
        fireEvent.input(inputBox, { target: { value: 'test' } });
      });

      await waitFor(() => {
        const cartLink = screen.getByText(/Cart/i);
        fireEvent.click(cartLink);
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeDefined();
        expect(
          screen.getByText(/Are you sure you want to leave this page/i),
        ).toBeDefined();
      });
    });

    it('should handle confirm dialog click', async () => {
      mocks.blocker.mockReturnValue({ state: 'blocked' });

      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        const inputBox = screen.getByRole('textbox');
        fireEvent.input(inputBox, { target: { value: 'test' } });
        const cartLink = screen.getByText(/Cart/i);
        fireEvent.click(cartLink);
      });

      await waitFor(() => {
        const confirmButton = screen.getByText(/Ok/i);
        fireEvent.click(confirmButton);
      });
    });

    it('should handle cancel dialog click', async () => {
      mocks.blocker.mockReturnValue({ state: 'blocked' });

      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        const inputBox = screen.getByRole('textbox');
        fireEvent.input(inputBox, { target: { value: 'test' } });
        const cartLink = screen.getByText(/Cart/i);
        fireEvent.click(cartLink);
      });

      await waitFor(() => {
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
      });

      // Dialog should still be present or handled appropriately
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull();
      });
    });
  });

  describe('Search and Filtering', () => {
    it('should filter products based on search text', async () => {
      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        const inputBox = screen.getByRole('textbox');
        fireEvent.input(inputBox, { target: { value: 'fjallraven' } });
        expect(
          screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i),
        ).toBeDefined();
      });
    });

    it('should update search text state on input', async () => {
      await act(async () => {
        renderWithRouter();
      });

      const inputBox = screen.getByRole('textbox');
      fireEvent.input(inputBox, { target: { value: 'fjall' } });

      expect(
        screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i),
      ).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should redirect to /error if cart fetch fails', async () => {
      mocks.fetchCart.mockResolvedValueOnce({
        data: mockCartData,
        status: 404,
      });

      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        expect(mocks.navigate).toHaveBeenCalledWith('/error');
      });
    });

    it('should redirect to /error if product fetch fails', async () => {
      mocks.fetchProduct.mockResolvedValueOnce({
        data: mockProductData,
        status: 500,
      });

      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        expect(mocks.navigate).toHaveBeenCalledWith('/error');
      });
    });
  });

  describe('Multiple Products', () => {
    it('should render multiple products correctly', async () => {
      const multiCartData = {
        ...mockCartData,
        products: [
          { productId: 1, quantity: 1 },
          { productId: 2, quantity: 1 },
        ],
      };

      const productData2 = {
        id: 2,
        title: 'Another Product',
        price: 50,
        description: 'desc',
        category: 'cat',
        image: 'img',
        rating: { rate: 4, count: 10 },
      };

      mocks.fetchCart.mockResolvedValueOnce({
        data: multiCartData,
        status: 200,
      });
      mocks.fetchProduct
        .mockResolvedValueOnce({ data: mockProductData, status: 200 })
        .mockResolvedValueOnce({ data: productData2, status: 200 });

      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i),
        ).toBeDefined();
        expect(screen.getByText(/Another Product/i)).toBeDefined();
      });
    });

    it('should handle duplicate products correctly', async () => {
      const duplicateCartData = {
        ...mockCartData,
        products: [...mockCartData.products, { productId: 1, quantity: 1 }],
      };

      mocks.fetchCart.mockResolvedValueOnce({
        data: duplicateCartData,
        status: 200,
      });

      await act(async () => {
        renderWithRouter();
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Fjallraven - Foldsack No. 1 Backpack/i),
        ).toBeDefined();
      });
    });
    it('should handle beforeunload event with preventDefault', async () => {
      await waitFor(() => {
        renderWithRouter();
      });

      await waitFor(() => {
        const inputBox = screen.getAllByRole('textbox')[0];
        fireEvent.input(inputBox, { target: { value: 'test data' } });
      });

      // Create a cancellable beforeunload event
      const beforeUnloadEvent = new Event('beforeunload', {
        cancelable: true,
        bubbles: true,
      });

      // Mock preventDefault to verify it's called
      const preventDefaultSpy = jest.fn();
      beforeUnloadEvent.preventDefault = preventDefaultSpy;

      // Dispatch the event using fireEvent
      act(() => {
        fireEvent(window, beforeUnloadEvent);
      });

      // Verify preventDefault was called
      expect(preventDefaultSpy).toHaveBeenCalled();

      // Verify event listener was added
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      );
    });
  });
});
