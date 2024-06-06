import OrderInfoandPayment from "@/components/OrderInfoandPayment";
import { CartContext } from "@/context/cartContext";
import { useGlobalContext } from "@/context/userContext";
import { Add, ShoppingCart } from "@mui/icons-material";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgMathMinus } from "react-icons/cg";
import Login from "./login";
import Auth from "@/components/Auth";

const Cart = () => {
  const [cartValue, setCartValue] = useState(false);
  const { auth } = useGlobalContext();

  const { cart, addToCart, removeProduct, clearCart } = useContext(CartContext);
  const [cartProducts, setCartProducts] = useState([]);

  // useEffect(() => {
  //   if (typeof window === undefined) {
  //     return;
  //   }

  //   if (window.location.href.includes("success=true")) {
  //     setCartValue(true);
  //     clearCart();
  //   }
  // }, [cart]);

  useEffect(() => {
    if (cart?.length > 0) {
      axios
        .post("/api/cart", { ids: cart })
        .then((response) => {
          setCartProducts(response?.data);
          // console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [cart]);

  let total = cart.reduce((acc, productId) => {
    let findProduct = cartProducts?.find((p) => p?._id === productId);
    return acc + (findProduct ? findProduct?.price : 0);
  }, 0);

  //   handleDecrease
  const handleDecrease = (ele) => {
    removeProduct(ele);
  };

  // handleIncrease
  const handleIncrease = (ele) => {
    addToCart(ele);
  };

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  // if (cartValue) {
  //   return (
  //     <>
  //       <div className="text-center my-6 shadow-lg p-6">
  //         <p>Thaks for your payment !!</p>
  //         <p>we will deliver your order as soon as possible 😊</p>
  //         <Link href={"/"}>
  //           <button className="mt-6  bg-orange-200 hover:bg-blue-100 p-2 rounded-lg">
  //             Go to home
  //           </button>
  //         </Link>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      <div className="text-center  my-5">
        {cart?.length === 0 && (
          <>
            <div className=" flex flex-col  justify-center items-center">
              <span>0</span>
              <ShoppingCart />
            </div>
            <p className="text-2xl mb-4">no items in cart !!</p>
            <Link href={`/`}>
              <button className="bg-blue-200 p-2 rounded-md   hover:bg-blue-100">
                Shop now
              </button>
            </Link>
          </>
        )}
      </div>

      {cart?.length !== 0 && (
        <>
          <div className="flex justify-between lg:flex-row flex-col ">
            <div className=" p-6 rounded-lg lg:w-[80%] w-[100%]">
              {cartProducts?.map((ele, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex justify-around sm:flex-row flex-col gap-6 items-center my-7 p-6  shadow-lg"
                  >
                    <div className="">
                      <img
                        src={ele?.images[0]}
                        alt=""
                        className="md:w-[200px] sm:w-[100%]"
                      />
                    </div>

                    <div className="flex flex-col gap-5 items-center">
                      {/* quantity */}
                      <h1 className="text-2xl font-mono">{ele?.name}</h1>

                      <div className="flex gap-6 items-center justify-center ">
                        <button className="w-[33px] bg-blue-200 hover:bg-blue-100 p-2 rounded-lg">
                          <CgMathMinus onClick={() => handleDecrease(ele)} />
                        </button>

                        <div>
                          <p> {cart?.filter((id) => id === ele?._id).length}</p>
                        </div>

                        <button className="   bg-blue-200 hover:bg-blue-100 p-1 rounded-lg">
                          <Add onClick={() => handleIncrease(ele)} />
                        </button>
                      </div>

                      {/* price */}
                      <div>
                        <p className="">
                          {" "}
                          ₹
                          {cart?.filter((id) => id === ele?._id).length *
                            ele?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {cart?.length > 0 && (
                <div className="text-center">
                  <p>
                    {" "}
                    Total Pay of{" "}
                    <span className="font-mono text-2xl">₹{total}</span>
                  </p>
                </div>
              )}
            </div>

            <OrderInfoandPayment cartData={cart} />
          </div>
        </>
      )}
    </>
  );
};

// export default Cart;

export default Auth(Cart);
