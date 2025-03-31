import Cart from './components/Cart/Cart';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/cart/:id" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
