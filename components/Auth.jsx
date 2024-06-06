// components/Auth.js
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context/userContext";
import React, { useEffect } from "react";

const Auth = (WrappedComponent) => {
  const { auth, isAuthInitialized } = useGlobalContext();
  const router = useRouter();
  return (props) => {
    // Define routes that don't require authentication
    const noAuthRequiredRoutes = [
      "/reset-password/[id]/[token]",
      "/forgot-password",
      "/register",
    ];

    useEffect(() => {
      if (isAuthInitialized) {
        const path = router.pathname;
        const isNoAuthRequiredRoute = noAuthRequiredRoutes.includes(path);

        if (
          !isNoAuthRequiredRoute &&
          (!auth?.user || !auth?.role || !auth?.token)
        ) {
          router.push("/login");
        }
      }
    }, [isAuthInitialized, router.pathname]);

    if (!isAuthInitialized) {
      return <div>Loading...</div>; // Loading indicator while auth state is being initialized
    }

    if (!auth?.user || !auth?.role || !auth?.token) {
      const path = router.pathname;
      const isNoAuthRequiredRoute = noAuthRequiredRoutes.includes(path);

      if (!isNoAuthRequiredRoute) {
        return null; // Prevent rendering anything until redirection
      }
    }

    return <WrappedComponent {...props} />;
  };
};

export default Auth;
