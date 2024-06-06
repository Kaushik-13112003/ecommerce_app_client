import Link from "next/link";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCloseCircle } from "react-icons/io";
import { CgProfile, CgShoppingCart } from "react-icons/cg";
import { CartContext } from "@/context/cartContext";
import { useGlobalContext } from "@/context/userContext";
import Login from "@/pages/login";
import { useRouter } from "next/navigation";
import Auth from "./Auth";

const Header = () => {
  // const { data: session } = useSession();
  const { setAuth } = useGlobalContext();
  // let status = session?.status;
  // console.log(status);
  const router = useRouter();
  const { auth } = useGlobalContext();
  const [toggle, setToggle] = useState(false);
  const { cart } = useContext(CartContext);

  const toggleFunction = useCallback(() => {
    setToggle((value) => !value);
  }, []);

  const handleLogout = () => {
    setAuth({
      user: "",
      role: "",
      token: "",
    });
    localStorage.removeItem("ecom-user-auth");
    window.location.replace("/login");
  };

  // useEffect(() => {
  //   if (!auth || !auth.user || !auth.role || !auth.token) {
  //     window.location.replace("/login");
  //   }
  // }, []);

  // if (!auth?.user || !auth?.role || !auth?.token) {
  //   return <Login />;
  // }

  return (
    <>
      <header className="border flex justify-between items-center bg-blue-50 p-3 ">
        <div>
          <Link
            href={"/"}
            className="hover:text-blue-500 text-2xl animate-pulse"
            style={{ textDecoration: "none" }}
          >
            BuyNow
          </Link>
        </div>

        {auth?.user && auth?.role === "User" && auth?.token && (
          <>
            <div className="hidden  gap-3 items-center sm:flex ">
              <Link
                href={`/profile/${auth?.user}`}
                className="hover:text-blue-500"
                style={{ textDecoration: "none" }}
              >
                <CgProfile size={30} />
              </Link>

              <Link
                href={"/"}
                className="hover:text-blue-500"
                style={{ textDecoration: "none" }}
              >
                Home
              </Link>

              <Link
                href={"/all-products"}
                className="hover:text-blue-500"
                style={{ textDecoration: "none" }}
              >
                Products
              </Link>

              <Link
                href={"/categories"}
                className="hover:text-blue-500"
                style={{ textDecoration: "none" }}
              >
                Categories
              </Link>

              <Link
                href={"/account"}
                className="hover:text-blue-500"
                style={{ textDecoration: "none" }}
              >
                Account
              </Link>

              <Link
                href={"/cart"}
                className="relative hover:text-blue-500 flex items-center gap-1"
                style={{ textDecoration: "none" }}
              >
                <p>Cart</p>{" "}
                <CgShoppingCart size={20} className="hover:text-blue-400" />
                <span className="absolute right-1 -top-4 text-blue-800">
                  {cart?.length}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="hover:text-blue-500"
                style={{ textDecoration: "none" }}
              >
                Logout
              </button>
            </div>
          </>
        )}

        <div className="sm:hidden block">
          {!toggle ? (
            <GiHamburgerMenu
              onClick={toggleFunction}
              className="cursor-pointer"
            />
          ) : (
            <IoIosCloseCircle
              onClick={toggleFunction}
              className="cursor-pointer"
            />
          )}
        </div>
      </header>

      <div>
        {auth?.user && auth?.role === "User" && auth?.token && (
          <>
            {toggle ? (
              <>
                <div className="bg-blue-200 p-2 sm:hidden  gap-4 items-center flex flex-col w-[100%]">
                  <Link
                    onClick={toggleFunction}
                    href={`/profile/${auth?.user}`}
                    className="hover:text-blue-500"
                    style={{ textDecoration: "none" }}
                  >
                    <CgProfile size={30} className="my-3" />
                  </Link>

                  <Link
                    href={"/"}
                    onClick={toggleFunction}
                    className="hover:text-blue-500 hover:bg-blue-100 w-[100%] text-center rounded-sm p-1"
                    style={{ textDecoration: "none" }}
                  >
                    Home
                  </Link>
                  <Link
                    onClick={toggleFunction}
                    href={"/all-products"}
                    className="hover:text-blue-500 hover:bg-blue-100 w-[100%] text-center rounded-sm p-1"
                    style={{ textDecoration: "none" }}
                  >
                    Products
                  </Link>
                  <Link
                    onClick={toggleFunction}
                    href={"/categories"}
                    className="hover:text-blue-500 hover:bg-blue-100 w-[100%] text-center rounded-sm p-1"
                    style={{ textDecoration: "none" }}
                  >
                    categories
                  </Link>
                  <Link
                    onClick={toggleFunction}
                    href={"/account"}
                    className="hover:text-blue-500 hover:bg-blue-100 w-[100%] text-center rounded-sm p-1"
                    style={{ textDecoration: "none" }}
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:text-blue-500"
                    style={{ textDecoration: "none" }}
                  >
                    Logout
                  </button>

                  <Link
                    onClick={toggleFunction}
                    href={"/cart"}
                    className="relative hover:text-blue-500 flex items-center gap-1"
                    style={{ textDecoration: "none" }}
                  >
                    <p className="my-2">Cart</p>{" "}
                    <CgShoppingCart size={20} className="hover:text-blue-400" />
                    <span className="absolute right-1 -top-2 text-blue-800">
                      {cart?.length}
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </>
  );
};

// export default Header;
export default Auth(Header);

