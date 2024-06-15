import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const router = useRouter();
  let { id } = router.query;
  let { token } = router.query;
  console.log(id, token);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [goHome, setGoHome] = useState(false);
  const [goError, setGoError] = useState(false);

  //   reset password
  const resetPassword = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("password not matched");
      return;
    }

    try {
      let res = await fetch("/api/forgot-password", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ password, confirmPassword, id, token }),
      });
      let dataFromResponse = await res.json();
      console.log(dataFromResponse);
      if (dataFromResponse?.expire) {
        // setGoError(true);
        toast.error("token expired !! try again");

        window.location.href = "/forgot-password";
        return;
      }
      if (res.ok) {
        toast.success("password reset successfully");
        setGoHome(true);
      } else {
        toast.error(dataFromResponse?.msg);
        setGoHome(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (goHome) {
    router.push("/login");
  }

  // if (goError) {
  //   router.push("/not-found");
  // }

  return (
    <>
      <div className=" bg-blue-200 p-3 h-screen">
        <h1 className="text-primary text-2xl text-center p-5">
          Reset Password
        </h1>
        <div className="flex   rounded-md  items-center flex-col justify-center p-7">
          <>
            <form
              className="md:w-[50%] p-5 rounded-md bg-blue-50 sm:w-[70%] w-[90%] flex gap-6 flex-col"
              onSubmit={resetPassword}
            >
              <div className="flex flex-col gap-3 p-2 ">
                <label htmlFor=" password">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="xyz"
                  className="bg-blue-200 rounded-lg p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3 p-2 ">
                <label htmlFor="confirm password">Confirm Password</label>
                <input
                  type="password"
                  name="confirm password"
                  placeholder="xyz"
                  className="bg-blue-200 rounded-lg p-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button className="bg-blue-200 p-2 w-[100%]  rounded-md hover:bg-blue-100">
                Continue
              </button>
            </form>
          </>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
