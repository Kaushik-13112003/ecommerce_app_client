import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
// import { toast } from "react-toastify";
import { IoPizzaOutline } from "react-icons/io5";
import { signIn } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { connectDB } from "@/lib/mongoose";
import userInfoModel from "@/model/userInfoModel";
import Auth from "@/components/Auth";

const UpdateProfile = ({ userData }) => {
  const profileData = userData[0];
  const router = useRouter();
  const [name, setName] = useState(profileData?.name);
  const [role, setRole] = useState(profileData?.role);
  const [email, setEmail] = useState(profileData?.email);
  const [password, setPassword] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState(profileData?.city);
  const [postalCode, setPostalCode] = useState(profileData?.postalCode);
  const [state, setState] = useState(profileData?.state);
  const [country, setCountry] = useState(profileData?.country);
  const [address, setAddress] = useState(profileData?.address);
  const [images, setImages] = useState(profileData?.image);
  const [goBack, setGoBack] = useState(false);

  const handleChange = async (event) => {
    event.preventDefault();

    let updatePromise = new Promise(async (resolve, reject) => {
      setIsUpdated(false);
      setGoBack(false);
      try {
        const res = await fetch(`/api/profile`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            image: images != [] ? images : "",
            city,
            postalCode,
            address,
            state,
            email,
            country,
            id: profileData?._id,
          }),
        });

        const dataFromResponse = await res.json();
        if (res.ok) {
          resolve();
          setIsUpdated(true);
          setGoBack(true);
        } else {
          reject();
          setGoBack(false);

          setIsUpdated(false);
          setError(dataFromResponse?.msg);

          setTimeout(() => {
            setError("");
          }, 1200);
        }

        toast.promise(updatePromise, {
          loading: "updating profile...",
          success: "profile updated ",
          error: "something went wrong !!",
        });
      } catch (err) {
        console.log(err);
      }
    });
  };

  // handleImageUpload

  const handleImageUpload = (event) => {
    let files = event.target.files;
    // console.log(files);

    if (files) {
      let data = new FormData();

      if (files.length === 1) {
        data.set("file", files[0]);

        try {
          let uploadImagePromise = new Promise(async (resolve, reject) => {
            let res = await fetch("/api/upload", {
              method: "POST",

              body: data,
            });

            let dataFromResponse = await res.json();
            if (res.ok) {
              resolve();
              console.log(dataFromResponse);
              setImages(dataFromResponse?.links[0]);
            } else {
              reject();
            }
          });

          toast.promise(uploadImagePromise, {
            loading: "uploading image...",
            success: "image uploaded !!",
            error: "somethong went wrong",
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  if (goBack) {
    router.push(`/profile/${profileData?._id}`);
  }
  return (
    <>
      <div className=" bg-blue-50 p-3">
        <h1 className="text-primary text-2xl text-center p-5">
          Updating Profile...
        </h1>

        {!isUpdated && error && (
          <>
            <p className="text-center text-red-400 ">{"complete field"}</p>
          </>
        )}

        <div className="flex  items-center justify-center p-7">
          <form
            action=""
            className="md:w-[50%] sm:w-[70%] w-[90%] flex gap-10 flex-col"
            onSubmit={handleChange}
          >
            <label className=" cursor-pointer rounded-md  relative -bottom-6 flex gap-2 bg-blue-200 hover:bg-blue-50 p-3 items-center justify-center">
              Upload Photo <CgProfile size={30} />
              <input
                type="file"
                hidden
                onChange={handleImageUpload}
                className="border p-3 rounded-md focus:bg-blue-100"
              />
            </label>
            {images?.length > 0 && (
              <>
                <div className="flex items-center justify-center">
                  <div className=" relative md:h-[170px]  sm:w-[130px] w-[100px]">
                    <img
                      src={images}
                      className=" cursor-pointer rounded-lg w-[100%] h-[100%]"
                    ></img>
                    <button
                      className="absolute right-0 bottom-0"
                      type="button"
                      onClick={() => setImages([])}
                    >
                      {" "}
                      <FaTrash className=" text-red-600 hover:text-red-400" />
                    </button>
                  </div>{" "}
                </div>
              </>
            )}
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor=" name">Name</label>
              <input
                type="text"
                name="name"
                placeholder=" john"
                className="bg-blue-200 rounded-lg p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor=" email">E-Mail</label>
              <input
                disabled
                type="email"
                name="email"
                placeholder="john@gmail.com"
                className="bg-blue-200 rounded-lg p-2"
                value={profileData?.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor=" select role">Select role</label>

              <select
                disabled
                className="bg-blue-200 rounded-lg p-2 cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="User">User</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 p-2 ">
              <label htmlFor=" address">Address</label>
              <input
                type="text"
                name="address"
                placeholder=" b-32,ramnagar"
                className="bg-blue-200 rounded-lg p-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex justify-between  items-center">
              <div className="flex flex-col gap-3 p-2 w-[100%]">
                <label htmlFor=" city">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder=" surat"
                  className="bg-blue-200 rounded-lg p-2 w-[100%]"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 p-2 w-[100%]">
                <label htmlFor=" postal code">Postal Code</label>
                <input
                  type="number"
                  name="postalCode"
                  placeholder=" 352812"
                  className="bg-blue-200 rounded-lg p-2 w-[100%]"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between  items-center">
              <div className="flex flex-col gap-3 p-2 w-[100%] ">
                <label htmlFor=" state">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder=" gujrat"
                  className="bg-blue-200 rounded-lg p-2 w-[100%]"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 p-2 w-[100%]">
                <label htmlFor=" country">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="india"
                  className="bg-blue-200 rounded-lg p-2 w-[100%]"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
            <button className="bg-blue-200 p-2 w-[100%]  rounded-md hover:bg-blue-50">
              Update
            </button>{" "}
          </form>
        </div>
      </div>
    </>
  );
};

// export default UpdateProfile;
export default Auth(UpdateProfile);

export async function getServerSideProps(context) {
  const { id } = context.query;

  await connectDB();

  try {
    const userData = await userInfoModel.find({
      _id: id,
    });

    return {
      props: {
        userData: JSON.parse(JSON.stringify(userData)),
      },
    };
  } catch (err) {
    console.log(err);
    return { props: { userData: null } };
  }
}
