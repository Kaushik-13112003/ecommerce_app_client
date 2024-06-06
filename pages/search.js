import React, { useContext, useState } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { CartContext } from "@/context/cartContext";
import { WatchListContext } from "@/context/watchListContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import { useGlobalContext } from "@/context/userContext";
import Login from "./login";
import Auth from "@/components/Auth";

const Search = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { addProductToWatchList, productIds } = useContext(WatchListContext);
  const { auth } = useGlobalContext();

  //debounce search
  const debounceSearch = debounce(async (value) => {
    if (value === "") {
      setSearchResult([]);
      return;
    }

    try {
      let res = await fetch(`/api/search?search=${value}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      // console.log(dataFromResponse);

      if (dataFromResponse?.length <= 0) {
        setError(true);
        setSearchResult([]);
        setSearchKeyword("");

        setTimeout(() => {
          setError(false);
        }, [1200]);
        return;
      }
      if (res.ok) {
        setSearchResult(dataFromResponse);
      }
    } catch (err) {
      console.log(err);
      setError(true);
    }
  }, 1000);

  // console.log(searchResult);

  const handleSearch = (event) => {
    let { value } = event.target;

    setSearchKeyword(value);
    debounceSearch(value);
  };

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return (
    <>
      {" "}
      <div className=" flex justify-center items-center">
        <div className="bg-blue-50 p-6 md:w-[50%] sm:-w-[80%] w-[90%] rounded-lg m-6 h-[100%] ">
          <h1 className=" p-4 text-2xl text-center">Search Products</h1>
          <form className="flex flex-col  gap-4 ">
            <div className="flex flex-col gap-3 p-2 ">
              <input
                type="text"
                name="name"
                placeholder="type here..."
                className="bg-blue-200 rounded-lg p-2"
                value={searchKeyword}
                onChange={handleSearch}
              />
            </div>
          </form>
        </div>
      </div>
      {error && <h1 className="text-2xl text-center p-6">no products found</h1>}
      {searchResult?.length > 0 && (
        <>
          <div className="h-auto  bg-blue-50">
            <h1 className="text-2xl text-center p-6">Search result</h1>

            <div className="flex  justify-center items-center">
              <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  p-8 rounded-lg gap-7">
                {searchResult?.map((ele, idx) => {
                  return (
                    <>
                      <div
                        key={idx}
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
    </>
  );
};

// export default search;
export default Auth(Search);
