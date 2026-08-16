import { useState } from "react";
import Link from "next/link";
import { HiOutlineTrash, HiOutlineShoppingCart } from "react-icons/hi";

const initialItems = [
  { id: 1, name: "Web Hosting - Starter", price: 5.99, qty: 1 },
  { id: 2, name: "Domain - .com (1yr)", price: 12.99, qty: 1 },
];

const CartScreen = () => {
  const [items, setItems] = useState(initialItems);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item
        )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-darkGray text-black dark:text-white px-5 md:px-10 py-10">
      <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <HiOutlineShoppingCart className="text-6xl opacity-40" />
          <p className="text-xl opacity-70">Your cart is empty</p>
          <Link href={"/"}>
            <button className="rounded-full bg-primary text-white py-2 px-6 font-bold">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-gray-300 dark:border-gray-700 rounded-xl p-4"
              >
                <div>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className="opacity-60">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="px-3 py-1 text-xl"
                    >
                      -
                    </button>
                    <span className="px-2">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="px-3 py-1 text-xl"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-2xl"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80 border border-gray-300 dark:border-gray-700 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-extrabold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-6 font-bold text-lg border-t border-gray-300 dark:border-gray-700 pt-4">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="w-full rounded-full bg-primary text-white py-3 font-bold">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
