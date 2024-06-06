import { CartContext } from "@/context/cartContext";
import { connectDB } from "@/lib/mongoose";
import productModel from "@/model/productModel";
import React, { use, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import reviewModel from "@/model/reviewModel";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Link from "next/link";
import { useGlobalContext } from "@/context/userContext";
import Login from "../login";
import Auth from "@/components/Auth";
import ProductComponent from "@/components/ProductComponent";
import { useRouter } from "next/router";
import StartComponet from "@/components/StartComponet";

const SingleProduct = ({
  // allProductsOfSameCategory,
  // singleProduct,
  // initialReviews,
  defaultAvgValue,
}) => {
  const { addToCart } = useContext(CartContext);
  const { auth } = useGlobalContext();
  const router = useRouter();
  const { id } = router?.query;
  // console.log(id);

  const [isActive, setisActive] = useState("");
  const [stars, setStars] = useState("");
  const [singleProductData, setSingleproductData] = useState("");
  const [avgReviews, setAvgReviews] = useState(defaultAvgValue);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [error, setError] = useState(false);
  const [relevantProducts, setRelevantProducts] = useState([]);

  const [show, setShow] = useState(false);

  useEffect(() => {
    getUserData();
    getSingleProduct();
    getProductReviews();
    getAllSimiliarProducts();
    // setAvgReviews(defaultAvgValue);

    setRelevantProducts(
      relevantProducts?.filter((prod) => {
        return prod?._id !== id;
      })
    );

    if (allReviews?.length > 0) {
      setStars(
        allReviews?.reduce((acc, ele) => {
          return (acc += ele?.rating);
        }, 0) / allReviews?.length
      );
    }
  }, [id, singleProductData?._id, allReviews?.length, stars]);

  //handles how more reviews
  const handleShowMoreReviews = () => {
    setShow((prev) => !prev);
  };

  //reviews
  const handleAddReview = async (event) => {
    event.preventDefault();
    setError(false);

    if (message === "" || rating <= 0) {
      toast.error("complete review fields");
      return;
    }

    try {
      let res = await fetch("/api/reviews", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          rating,
          message,
          productId: singleProductData?._id,
          name,
          image,
        }),
      });

      let dataFromResponse = await res.json();
      if (res.ok) {
        // console.log(dataFromResponse);
        setAllReviews((prev) => [...prev, dataFromResponse]);

        // Reset rating and message
        setRating(0);
        setMessage("");
        toast.success("review added !!");
      } else {
        setError(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //products data
  const getSingleProduct = async () => {
    try {
      let res = await fetch(`/api/products?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      // console.log(dataFromResponse);

      if (res.ok) {
        setSingleproductData(dataFromResponse);
        setisActive(dataFromResponse?.images[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //product review
  const getProductReviews = async () => {
    try {
      let res = await fetch(`/api/reviews?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let dataFromResponse = await res.json();
      // console.log(dataFromResponse);

      if (res.ok) {
        setAllReviews(dataFromResponse);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //all products of same category
  const getAllSimiliarProducts = async () => {
    try {
      let res = await fetch(`/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, category: singleProductData?.category }),
      });

      let dataFromResponse = await res.json();
      // console.log(dataFromResponse);

      if (res.ok) {
        setRelevantProducts(
          dataFromResponse?.filter((prod) => {
            return prod?._id !== singleProductData?._id;
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  //user data
  const getUserData = async () => {
    try {
      let res = await fetch(`/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: auth?.user }),
      });

      let dataFromResponse = await res.json();

      if (res.ok) {
        setName(dataFromResponse?.name);
        setImage(dataFromResponse?.image);
        // console.log(dataFromResponse);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-blue-50 m-8 flex-wrap rounded-md p-5 flex justify-evenly sm:flex-row flex-col my-6 ">
        <div className="flex flex-col items-center gap-6">
          <div className="shadow p-3 sm:w-[300px] sm:h-[300px] w-[200px] h-[200px]">
            <img
              src={isActive ? isActive : ""}
              alt={singleProductData?.name}
              className="object-contain w-[100%] h-[100%]"
            />
          </div>

          <div>
            {singleProductData?.images?.length > 1 && (
              <>
                <div className="flex gap-4 flex-wrap  items-center">
                  {singleProductData?.images?.map((image, imgIdx) => {
                    return (
                      <div
                        className="shadow rounded-md p-2  w-[70px]"
                        key={imgIdx}
                      >
                        <img
                          src={image}
                          alt=""
                          onClick={() => setisActive(image)}
                          className="w-[100%] hover:animate-pulse    cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 my-7">
          <p className="sm:text-4xl text-3xl font-mono font-bold">
            {singleProductData?.name}
          </p>
          <p>{singleProductData?.des}</p>
          <p>₹{singleProductData?.price}</p>
          <StartComponet stars={stars} totalReviews={allReviews?.length} />
          <Link href={`/single-product-buy/${singleProductData?._id}`}>
            <button className="bg-blue-200 p-2 w-[100%]  rounded-md hover:bg-blue-100">
              Buy now
            </button>
          </Link>
          <button
            onClick={() => addToCart(singleProductData)}
            className="bg-blue-200 p-2 w rounded-md hover:bg-blue-100  w-[100%]"
          >
            Add to cart
          </button>{" "}
        </div>
      </div>
      <div className="bg-blue-50 m-8 rounded-md p-5  my-6 ">
        <h2 className="text-2xl font-bold mb-4">Add Review</h2>

        <div>
          <ReactStars
            size={30}
            activeColor="#ffd700"
            count={5}
            value={rating}
            onChange={setRating}
            key={`star-rating-${rating}`} // Force re-render by changing key
          ></ReactStars>
        </div>

        <textarea
          className="w-full mt-2 p-2 border rounded-md mb-4"
          placeholder="Write your review..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleAddReview}
          className="  bg-orange-200 hover:bg-blue-100 p-2 rounded-lg"
        >
          Add Review
        </button>
      </div>{" "}
      <div className="bg-blue-100 m-8 rounded-md p-5  my-6 ">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">All Reviews</h2>{" "}
          {show ? (
            <button
              className="hover:bg-blue-200 rounded-2xl p-2"
              onClick={() => handleShowMoreReviews()}
            >
              <IoIosArrowDown />
            </button>
          ) : (
            <button
              className="hover:bg-blue-200 rounded-2xl p-2"
              onClick={() => handleShowMoreReviews()}
            >
              <IoIosArrowUp />
            </button>
          )}
        </div>
        {allReviews?.length === 0 && <p>Be the first to add review !!</p>}
        {show &&
          allReviews?.map((ele, idx) => {
            return (
              <>
                <div className="bg-blue-50 rounded-md p-4 my-5" key={idx}>
                  <div className="flex gap-3 items-center">
                    <div className="w-[50px]">
                      <img
                        src={ele?.image}
                        className=" object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col ">
                      <p>{ele?.name}</p>
                      <p>{new Date(ele?.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div key={idx} className=" ">
                    <ReactStars
                      value={ele?.rating}
                      count={ele?.rating}
                      edit={false}
                    ></ReactStars>
                    <p>{ele?.message}</p>
                  </div>
                </div>
              </>
            );
          })}
      </div>{" "}
      {/* relevantProducts */}
      {relevantProducts?.length > 0 && (
        <>
          <h1 className="text-2xl text-center p-6">You might also like this</h1>
          <ProductComponent products={relevantProducts} />
        </>
      )}
    </>
  );
};

// export default singleProduct;
export default Auth(SingleProduct);

export async function getServerSideProps(context) {
  const { id } = context.query;

  await connectDB();

  try {
    const singleProduct = await productModel.findById({ _id: id }).lean();
    const reviews = await reviewModel
      .find({ productId: id })
      .sort({ createdAt: -1 })
      .lean();

    let allProductsOfSameCategory = await productModel.find({
      category: singleProduct?.category,
    });

    // console.log(allProductsOfSameCategory);

    // let relevantProducts = allProductsOfSameCategory.filter((prod) => {
    //   return prod?._id !== id;
    // });
    // console.log(relevantProducts);

    let defaultAvgValue =
      reviews?.reduce((acc, ele) => {
        return (acc += ele?.rating);
      }, 0) / reviews?.length;

    return {
      props: {
        singleProduct: JSON.parse(JSON.stringify(singleProduct)),
        initialReviews: JSON.parse(JSON.stringify(reviews)),
        allProductsOfSameCategory: JSON.parse(
          JSON.stringify(allProductsOfSameCategory)
        ),
        defaultAvgValue: defaultAvgValue,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { singleProduct: null, initialReviews: [], relevantProducts: [] },
    };
  }
}
