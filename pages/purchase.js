import { useGlobalContext } from "@/context/userContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Login from "./login";

const Purchase = () => {
  const [ok, setOk] = useState(false);
  const { auth } = useGlobalContext();

  useEffect(() => {
    if (window.location.href.includes("success=true")) {
      setOk(true);
    }
  }, [ok]);

  if (ok) {
    return (
      <>
        <div className="text-center my-6 shadow-lg p-6">
          <p>Thaks for your payment !!</p>
          <p>we will deliver your order as soon as possible 😊</p>
          <Link href={"/"}>
            <button className="mt-6  bg-orange-200 hover:bg-blue-100 p-2 rounded-lg">
              Go to home
            </button>
          </Link>
        </div>
      </>
    );
  }

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return <></>;
};

export default Purchase;
