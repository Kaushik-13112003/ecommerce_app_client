import { useGlobalContext } from "@/context/userContext";
import { connectDB } from "@/lib/mongoose";
import userInfoModel from "@/model/userInfoModel";
import React, { useEffect, useState } from "react";
import Auth from "./Auth";

const MyOrders = () => {
  const { auth } = useGlobalContext();
  const [allOrders, setAllOrders] = useState([]);

  const getUserData = async () => {
    try {
      let res = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: auth?.user }),
      });

      let dataFromResponse = await res.json();

      if (res.ok) {
        setAllOrders(dataFromResponse);
        // console.log(dataFromResponse);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // console.log(allOrders);
  return (
    <>
      <div>
        <div className="text-center p-3">
          {allOrders?.length === 0 && (
            <>
              <p>No orders yet !!</p>
            </>
          )}
        </div>

        <div>
          {allOrders?.map((ele, idx) => {
            return (
              <div
                key={idx}
                className="bg-blue-100 items-center rounded-md p-4 flex sm:flex-row flex-col gap-5 justify-around  m-6"
              >
                <div className=" flex flex-col gap-6">
                  <div>
                    <p className="font-mono font-bold">Order ID</p>
                    <p>{ele?._id}</p>
                  </div>

                  <div>
                    <p className="font-mono font-bold">Order Date</p>
                    <p>{new Date(ele?.createdAt).toLocaleString()}</p>
                  </div>

                  <div>
                    <h1 className="font-mono font-bold">Recipient</h1>
                    <p>{ele?.name}</p>
                    <p>{ele?.email}</p>
                    <p>
                      {ele?.address},{ele?.city} - {ele?.postalCode}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-md p-5 m-2">
                  {" "}
                  {ele?.line_items?.map((line_ele, line_idx) => {
                    return (
                      <>
                        <div key={line_idx} className="mb-4">
                          <h1 className="font-mono font-bold ">Product</h1>
                          <p>
                            {line_ele?.price_data?.product_data?.name} x{" "}
                            <span className="text-blue-600">
                              {" "}
                              {line_ele?.quantity}
                            </span>
                          </p>
                          <p className="my-3">
                            {" "}
                            <p className="font-mono font-bold">
                              {" "}
                              {(line_ele?.price_data?.unit_amount / 100) *
                                line_ele?.quantity}{" "}
                              ₹
                            </p>
                          </p>
                          {line_idx !== ele?.line_items?.length - 1 && (
                            <div className="h-[1px] bg-blue-200 mb-3 mt-2"></div>
                          )}{" "}
                        </div>
                      </>
                    );
                  })}
                </div>

                <div>
                  <p>
                    status :{" "}
                    {ele?.status === "Pending" && (
                      <span className="text-yellow-600">{ele?.status}</span>
                    )}
                    {ele?.status === "Processing" && (
                      <span className="text-orange-400">{ele?.status}</span>
                    )}
                    {ele?.status === "Shipped" && (
                      <span className="text-blue-600">{ele?.status}</span>
                    )}
                    {ele?.status === "In Transit" && (
                      <span className="text-blue-400">{ele?.status}</span>
                    )}
                    {ele?.status === "Out for Delivery" && (
                      <span className="text-purple-600">{ele?.status}</span>
                    )}
                    {ele?.status === "Delivered" && (
                      <span className="text-green-600">{ele?.status}</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

// export default MyOrders;
export default Auth(MyOrders);
