import Link from "next/link";
import React, { useContext } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { CartContext } from "@/context/cartContext";
import { WatchListContext } from "@/context/watchListContext";
import { useGlobalContext } from "@/context/userContext";
import Login from "@/pages/login";
import Auth from "./Auth";

const LatestProducts = ({ latestProducts }) => {
  const { addToCart } = useContext(CartContext);
  const { addProductToWatchList, productIds } = useContext(WatchListContext);

  // const { auth } = useGlobalContext();

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return (
    <>
      <div className="h-auto  bg-blue-50">
        <h1 className="text-2xl text-center p-6">Latest products</h1>

        <div className="flex  justify-center items-center">
          <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  p-8 rounded-lg gap-7">
            {latestProducts?.map((ele, idx) => {
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
                                className={`    sm:w-[300px]   hover:animate-pulse w-[250px] object-contain h-[250px]`}
                              />
                            </Link>

                            <button
                              className={`absolute right-2 top-1                                  
                              ${
                                productIds?.includes(ele?._id)
                                  ? "text-blue-400"
                                  : "bg-white"
                              }`}
                              onClick={() => addProductToWatchList(ele?._id)}
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
  );
};

// export default LatestProducts;
export default Auth(LatestProducts);

