import { Cart } from "./components/Cart";
import { Navigation } from "./components/common/Navigation";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
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

function App() {
  return <RouterProvider router={router} />;
}

export default App;
