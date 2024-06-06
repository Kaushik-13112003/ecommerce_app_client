import { connectDB } from "@/lib/mongoose";
import categoryModel from "@/model/categoryModel";
import Link from "next/link";
import React from "react";
import Login from "./login";
import { useGlobalContext } from "@/context/userContext";
import Auth from "@/components/Auth";

const Categories = ({ allCategories }) => {
  // const { auth } = useGlobalContext();

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return (
    <>
      <div className="flex justify-center items-center m-6">
        <div className=" grid sm:grid-cols-3  gap-3 gird-cols-1">
          {allCategories?.map((ele, idx) => {
            return (
              <Link
                href={`/category/${ele?._id}`}
                key={ele?._id}
                className="bg-blue-100 hover:bg-blue-50 p-5 rounded-lg sm:w-[200px] w-[70vw] text-center"
              >
                {ele?.category}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

// export default categories;
export default Auth(Categories);

export async function getServerSideProps() {
  await connectDB();
  try {
    let allCategories = await categoryModel.find().sort({ createdAt: -1 });
    return {
      props: { allCategories: JSON.parse(JSON.stringify(allCategories)) },
    };
  } catch (err) {
    console.log(err);
  }
}
