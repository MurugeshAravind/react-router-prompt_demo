import { Cart } from './components/Cart';
import { Navigation } from './components/common/Navigation';
import { PageNotFound } from './components/common/PageNotFound';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
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
    element: <PageNotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
