import Featured from "@/components/Featured";
import Header from "@/components/Header";
import LatestProducts from "@/components/LatestProducts";
import SearchProducts from "@/components/Search";
import { useGlobalContext } from "@/context/userContext";
import { connectDB } from "@/lib/mongoose";
import productModel from "@/model/productModel";
import React, { useEffect } from "react";
import Login from "./login";
import Auth from "@/components/Auth";

const Index = ({ product, latestProducts }) => {
  const { auth } = useGlobalContext();

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return (
    <>
      {/* <Header /> */}

      {/* {auth?.user && auth?.token && auth?.role === "User" && ( */}
        <>
          <Featured product={product} />
          {/* <ListProducts /> */}
          <LatestProducts latestProducts={latestProducts} />

          <div>{<SearchProducts />}</div>
        </>
      {/* )} */}
    </>
  );
};

// export default Index;

export async function getServerSideProps() {
  //mongoose object not compatible with props as below so converted to stringify & then parsed
  const productId = "6655b05d41e06747ab877998";
  await connectDB();
  try {
    // let findProduct = await productModel.findById({ _id: productId });
    let findProduct = await productModel.findOne({ isFeatured: true });
    let latestProducts = await productModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(6);
    return {
      props: {
        product: JSON.parse(JSON.stringify(findProduct)),
        latestProducts: JSON.parse(JSON.stringify(latestProducts)),
      },
    };
  } catch (err) {
    console.log(err);
  }
}

export default Auth(Index);
