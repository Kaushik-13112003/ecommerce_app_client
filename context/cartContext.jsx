import toast from "react-hot-toast";

const { createContext, useState, useEffect } = require("react");

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const defaultProducts = ls ? ls?.getItem("ecommerce_cart") : [];

  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (cart?.length > 0 && ls) {
      ls?.setItem("ecommerce_cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (ls && defaultProducts) {
      setCart(JSON.parse(defaultProducts));
    }
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      return [...prev, product?._id];
    });

    // toast.success("product added to cart");
  };

  const removeProduct = (product) => {
    // setCart

    setCart((prev) => {
      let position = prev.indexOf(product?._id);
      console.log(position);

      if (position !== -1) {
        return prev.filter((pid, idx) => {
          return idx !== position;
        });
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ecommerce_cart");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeProduct, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
