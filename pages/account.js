import { WatchListContext } from "@/context/watchListContext";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { CartContext } from "@/context/cartContext";
import { useGlobalContext } from "@/context/userContext";
import Login from "./login";
import MyOrders from "@/components/MyOrders";
import Auth from "@/components/Auth";

const Account = () => {
  const [toggle, setToggle] = useState(false);
  const { auth } = useGlobalContext();
  const [isActive, setIsActive] = useState(false);

  const { addProductToWatchList, productIds } = useContext(WatchListContext);
  const { addToCart } = useContext(CartContext);

  const [allProducts, setAllProducts] = useState([]);

  //   fetchProducts from localstorage
  useEffect(() => {
    if (productIds?.length > 0) {
      axios
        .post("/api/account", { ids: productIds })
        .then((response) => {
          setAllProducts(response?.data);
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setAllProducts([]);
    }
  }, [productIds]);

  //tab view
  const handleToggle = () => {
    setToggle((prev) => !prev);
    setIsActive((prev) => !prev);
  };

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return (
    <>
      <div className="flex justify-evenly items-center">
        <button
          className={` ${
            !toggle && !isActive ? "bg-blue-300" : "bg-blue-200"
          }   p-2 w-[100%] `}
          onClick={() => handleToggle()}
        >
          WatchList
        </button>
        <button
          className={` ${
            toggle && isActive ? "bg-blue-300" : "bg-blue-200"
          }   p-2 w-[100%] `}
          onClick={() => handleToggle()}
        >
          My Orders
        </button>
      </div>

      <div>
        {!toggle && !isActive && (
          <>
            <div className="h-auto  bg-blue-50">
              {/* <h1 className="text-2xl text-center p-6">Watchlist products</h1> */}

              <div className="flex  justify-center items-center">
                {allProducts?.length <= 0 && (
                  <p className="text-center p-3">no products in watchlist</p>
                )}
                <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  p-8 rounded-lg gap-7">
                  {allProducts &&
                    allProducts?.map((ele, idx) => {
                      return (
                        <>
                          <div
                            key={ele?._id}
                            className="sm:w-[300px] w-[250px] my-6 h-auto shadow rounded-md flex flex-col gap-6  cursor-pointer "
                          >
                            <div className="">
                              {ele?.images?.length > 0 && (
                                <>
                                  <div className="relative ">
                                    <Link href={`/single-product/${ele?._id}`}>
                                      <img
                                        src={ele?.images[0]}
                                        alt={ele?.name}
                                        className="sm:w-[300px]   hover:animate-pulse w-[250px] object-contain h-[250px]"
                                      />
                                    </Link>

                                    <button
                                      className={`absolute right-2 top-1                                  
                              ${
                                productIds?.includes(ele?._id)
                                  ? "text-blue-400"
                                  : "bg-white"
                              }`}
                                      onClick={() =>
                                        addProductToWatchList(ele?._id)
                                      }
                                    >
                                      <FavoriteBorderIcon />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="flex flex-col gap-4 p-4 ">
                              <h2 className="text-2xl ">{ele?.name}</h2>
                              <p className="text-blue-600">₹{ele?.price}</p>

                              <div className="flex justify-between  gap-3 sm:flex-row flex-col ">
                                <Link
                                  href={`/single-product/${ele?._id}`}
                                  className="w-[100%]"
                                >
                                  <button className="bg-blue-200 p-2 w-[100%]  rounded-md hover:bg-blue-100">
                                    See more
                                  </button>
                                </Link>

                                <div className="w-[100%]">
                                  <button
                                    onClick={() => addToCart(ele)}
                                    className="bg-blue-200 p-2 w rounded-md hover:bg-blue-100  w-[100%]"
                                  >
                                    Add to cart
                                  </button>{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div>
        {toggle && isActive && (
          <>
            <MyOrders />
          </>
        )}
      </div>
    </>
  );
};

// export default account;
export default Auth(Account);
