import { CartContext } from "@/context/cartContext";
import { useGlobalContext } from "@/context/userContext";
import Login from "@/pages/login";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import Auth from "./Auth";

const Featured = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  // const { auth } = useGlobalContext();

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return (
    <>
      <div className="h-screen bg-no-repeat lg:bg-repeat bg-cover  bg-orange-200 p-4 bg-[url('/bg.jpg')] flex gap-3 flex-col items-center">
        <div>
          <h1 className="text-center text-2xl my-5 greet">Welcome to BuyNow</h1>
        </div>

        <div className="flex   items-center gap-10 flex-col">
          <div className="hover:animate-pulse  shadow-white rounded-lg sm:w-[240px] sm:h-[240px] w-[200px] h-[200px]">
            <Link href={`/single-product/${product?._id}`}>
              <img
                src={product?.images[0]}
                className=" object-contain w-[100%] h-[100%]"
              />
              <p className="text-center bg-blue-50 w-[100%] object-contain">
                {product?.name}
              </p>
            </Link>
          </div>

          <div className="flex w-[100%] md:flex-row flex-col gap-6 justify-between items-center">
            <div className="  md:w-auto w-[100%]">
              <Link href={`/single-product/${product?._id}`}>
                <button className="bg-blue-50 p-2 rounded-md w-[100%]  hover:bg-blue-100">
                  Shop now
                </button>
              </Link>
            </div>

            <div className=" md:w-auto w-[100%]">
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-50 p-2 w-[100%]  rounded-md hover:bg-blue-100"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// export default Featured;
export default Auth(Featured);
