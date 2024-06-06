import { useGlobalContext } from "@/context/userContext";
import { Login, Search } from "@mui/icons-material";
import Link from "next/link";
import React from "react";
import Auth from "./Auth";

const SearchProducts = () => {
  const { auth } = useGlobalContext();

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return (
    <>
      <Link href={"/search"}>
        <div className="fixed bottom-6 right-7 bg-white p-4 rounded-full cursor-pointer hover:bg-blue-50 animate-pulse">
          <Search />
        </div>
      </Link>
    </>
  );
};

// export default SearchProducts;
export default Auth(SearchProducts);



