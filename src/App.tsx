import { Cart } from './components/Cart';
import { Navigation } from './components/common/Navigation';
import { PageNotFound } from './components/common/PageNotFound';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navigation />
        <Cart />
      </>
    ),
  },
  {
    path: '/cart/:id',
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
