import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div className="flex flex-row justify-between bg-gray-300 p-4">
      <Link to="/react-router-prompt_demo/">
        <strong>Home</strong>
      </Link>
      <Link to={`/react-router-prompt_demo/cart/5`}>
        <strong>Cart</strong>
      </Link>
    </div>
  );
};

export default Navigation;
