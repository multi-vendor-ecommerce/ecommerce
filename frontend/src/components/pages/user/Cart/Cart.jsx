import React from "react";
import { useCart } from "../Cart/CartContext";
import CartItems from "./CartItems";

export default function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="mt-16 bg-user-base min-h-screen text-user-dark p-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-lg text-center">🛒 Your cart is empty 😢</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded shadow flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-contain bg-white rounded"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{item.name}</h4>
                      <p className="text-user-primary font-medium">
                        ₹{item.price} x {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-3 bg-user-secondary text-white rounded"
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-3 bg-user-secondary text-white rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-[300px] bg-white p-4 rounded shadow h-fit">
              <h3 className="text-lg font-bold mb-4">Price Details</h3>
              <div className="flex justify-between mb-2">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold mt-4">
                <span>Grand Total</span>
                <span>₹{totalAmount}</span>
              </div>
              <button className="mt-4 w-full bg-user-primary text-white py-2 rounded hover:bg-user-secondary">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Optional: Cart item list or summary below */}
      <CartItems />
    </div>
  );
}
