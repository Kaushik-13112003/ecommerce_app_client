import { connectDB } from "@/lib/mongoose";
import productModel from "@/model/productModel";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { CartContext } from "@/context/cartContext";
import { WatchListContext } from "@/context/watchListContext";
import { useGlobalContext } from "@/context/userContext";
import Login from "../login";
import { IoAddCircleOutline } from "react-icons/io5";

const categoryWiseProducts = ({ allProducts }) => {
  const { addToCart } = useContext(CartContext);
  const [sortBy, setSortBy] = useState("All");
  const { addProductToWatchList, productIds } = useContext(WatchListContext);
  const [sortedProducts, setSortedProducts] = useState([...allProducts]);

  //show limited products
  const [initialProducts, setInitialProducts] = useState(6);
  const [loadMore, setLoadMore] = useState(false);
  const [displayProducts, setDisplayProducts] = useState();

  //sort products
  useEffect(() => {
    let sorted = [...allProducts];
    if (sortBy === "lowest") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highest") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setSortedProducts(sorted);
  }, [sortBy]);

  //handleLoadMore
  const handleLoadMore = () => {
    setInitialProducts((prev) => prev + 6);
  };

  useEffect(() => {
    if (allProducts?.length > 0 && allProducts) {
      setSortedProducts(allProducts?.slice(0, initialProducts));
      setLoadMore(initialProducts < allProducts?.length);
    }
  }, [loadMore, initialProducts]);

  return (
    <>
      <div className="h-auto  bg-blue-50">
        <div className="flex justify-around items-center">
          <h1 className="text-2xl text-center p-6">Latest products</h1>

          <select
            className="bg-blue-200 rounded-lg p-2 cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="All">All</option>

            <option value="lowest">price,lowest first</option>
            <option value="highest">price,highest first</option>
            <option value="newest ">newest first</option>
            <option value="oldest">oldest first</option>
          </select>
        </div>

        <div className="flex  justify-center items-center">
          <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  p-8 rounded-lg gap-7">
            {sortedProducts?.map((ele, idx) => {
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

        <div className="flex justify-center items-center p-4 cursor-pointer ">
          {loadMore && (
            <>
              <IoAddCircleOutline
                size={25}
                onClick={handleLoadMore}
                className="hover:text-blue-400"
              />
            </>
          )}

          {!loadMore && <p>no more products</p>}
        </div>
      </div>
    </>
  );
};

export default categoryWiseProducts;

export async function getServerSideProps(context) {
  const { id } = context.query;

  await connectDB();

  try {
    const allProducts = await productModel.find({
      category: id.toString(),
    });

    return {
      props: {
        allProducts: JSON.parse(JSON.stringify(allProducts)),
      },
    };
  } catch (err) {
    console.log(err);
    return { props: { allProducts: null } };
  }
}
