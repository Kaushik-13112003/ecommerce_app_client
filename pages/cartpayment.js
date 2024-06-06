import { CartContext } from "@/context/cartContext";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

const Cartpayment = () => {
  const [cartValue, setCartValue] = useState(null); // Updated to null initially

  const { cart, clearCart } = useContext(CartContext);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.location.href.includes("success=true")) {
      setCartValue(true);
      clearCart();
    }

    if (window.location.href.includes("success=false")) {
      setCartValue(false);
    }
  }, [cart]);

  if (cartValue !== null) {
    if (cartValue) {
      return (
        <div className="text-center my-6 shadow-lg p-6">
          <p>Thanks for your payment !!</p>
          <p>We will deliver your order as soon as possible 😊</p>
          <Link href={"/"}>
            <button className="mt-6 bg-orange-200 hover:bg-blue-100 p-2 rounded-lg">
              Go to home
            </button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="text-center my-6 shadow-lg p-6">
          <p>Something went wrong 😔!! Try again !!</p>
          <Link href={"/"}>
            <button className="mt-6 bg-orange-200 hover:bg-blue-100 p-2 rounded-lg">
              Go to Cart
            </button>
          </Link>
        </div>
      );
    }
  }

  return <></>;
};

export default Cartpayment;
