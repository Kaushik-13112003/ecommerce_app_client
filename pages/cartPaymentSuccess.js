import { CartContext } from "@/context/cartContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const CartPaymentSuccess = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [cartValue, setCartValue] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === undefined) {
      return;
    }

    if (window.location.href.includes("success=true")) {
      setCartValue(true);
      clearCart();
    }
  }, [cart]);

  if (cartValue) {
    return (
      <>
        <div className="text-center my-6 shadow-lg p-6">
          <p>Thaks for your payment !!</p>
          <p>we will deliver your order as soon as possible 😊</p>
          <Link href={"/"}>
            <button className="mt-6  bg-orange-200 hover:bg-blue-100 p-2 rounded-lg">
              Go to home
            </button>
          </Link>
        </div>
      </>
    );
  }

  return <div></div>;
};

export default CartPaymentSuccess;
