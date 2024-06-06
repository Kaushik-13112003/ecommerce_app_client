import OrderInfoandPayment from "@/components/OrderInfoandPayment";
import { connectDB } from "@/lib/mongoose";
import productModel from "@/model/productModel";
import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import { CgMathMinus } from "react-icons/cg";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context/userContext";
import Login from "../login";
import Auth from "@/components/Auth";

const SingleProductBuy = ({ singleProduct }) => {
  const { auth } = useGlobalContext();
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(singleProduct?.price);
  const [isActive, setisActive] = useState(singleProduct?.images[0]);

  //   handleDecrease
  const handleDecrease = () => {
    setQuantity((q) => q - 1);

    if (quantity <= 1) {
      setQuantity(1);
    }
  };

  // handleIncrease
  const handleIncrease = () => {
    setQuantity((q) => q + 1);
  };

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return (
    <>
      {singleProduct?._id !== null && (
        <>
          <div className="flex justify-between lg:flex-row flex-col ">
            <div className=" p-6 rounded-lg lg:w-[80%] w-[100%]">
              <div className="flex justify-around sm:flex-row flex-col gap-6 items-center my-7 p-6  shadow-lg">
                <div className="flex  flex-col gap-3 items-center justify-center">
                  <img
                    src={isActive}
                    alt=""
                    className="shadow md:w-[200px] sm:w-[100%]"
                  />

                  {singleProduct?.images?.length > 1 && (
                    <>
                      <div className="flex gap-4 flex-wrap  items-center">
                        {singleProduct?.images?.map((image) => {
                          return (
                            <div className="shadow rounded-md p-2  w-[70px]">
                              <img
                                src={image}
                                alt=""
                                onClick={() => setisActive(image)}
                                className="w-[100%] hover:animate-pulse  cursor-pointer"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-5 items-center">
                  {/* quantity */}
                  <h1 className="text-2xl font-mono">{singleProduct?.name}</h1>

                  <div className="flex gap-6 items-center justify-center ">
                    <button className="w-[33px] bg-blue-200 hover:bg-blue-100 p-2 rounded-lg">
                      <CgMathMinus onClick={() => handleDecrease()} />
                    </button>

                    <div>
                      <p> {quantity}</p>
                    </div>

                    <button className="   bg-blue-200 hover:bg-blue-100 p-1 rounded-lg">
                      <Add onClick={() => handleIncrease()} />
                    </button>
                  </div>

                  {/* price */}
                  <div>
                    <p className=""> ₹{singleProduct?.price}</p>
                  </div>
                </div>
              </div>

              {singleProduct?._id !== null && (
                <div className="text-center">
                  <p>
                    {" "}
                    Total Pay of{" "}
                    <span className="font-mono text-2xl">
                      ₹{total * quantity}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <OrderInfoandPayment
              cartData={[
                {
                  quantity: quantity,
                  total: singleProduct?.price * quantity, // Correctly calculate total based on quantity
                  singleProductId: singleProduct?._id,
                },
              ]}
            />
          </div>
        </>
      )}
    </>
  );
};

// export default SingleProductBuy;
export default Auth(SingleProductBuy);

export async function getServerSideProps(context) {
  const { id } = context.query;

  await connectDB();

  try {
    const singleProduct = await productModel.findById({ _id: id });

    return {
      props: {
        singleProduct: JSON.parse(JSON.stringify(singleProduct)),
      },
    };
  } catch (err) {
    console.log(err);
    return { props: { singleProduct: null } };
  }
}
