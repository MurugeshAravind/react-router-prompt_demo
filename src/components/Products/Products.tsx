import { Data } from '../Cart/Cart';

export const Products = ({ image, title, price }: Data) => {
  return (
    <>
      <a href="#" className="group">
        <img
          src={image}
          alt={title}
          className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
        />
        <h3 className="mt-4 text-sm text-gray-700">{title}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">${price}</p>
      </a>
    </>
  );
};
