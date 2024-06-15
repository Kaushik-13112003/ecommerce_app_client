// // components/Auth.js
// import { useRouter } from "next/router";
// import { useGlobalContext } from "@/context/userContext";
// import React, { useEffect } from "react";

// const Auth = (WrappedComponent) => {
//   return (props) => {
//     const { auth, isAuthInitialized } = useGlobalContext();
//     const router = useRouter();

//     // Define routes that don't require authentication
//     const noAuthRequiredRoutes = [
//       "/reset-password/[id]/[token]",
//       "/forgot-password",
//       "/register",
//     ];

//     useEffect(() => {
//       if (isAuthInitialized) {
//         const path = router.pathname;
//         const isNoAuthRequiredRoute = noAuthRequiredRoutes.includes(path);

//         if (
//           !isNoAuthRequiredRoute &&
//           (!auth?.user || !auth?.role || !auth?.token)
//         ) {
//           router.push("/login");
//         }
//       }
//     }, [isAuthInitialized, router.pathname]);

//     if (!isAuthInitialized) {
//       return <div>Loading...</div>; // Loading indicator while auth state is being initialized
//     }

//     if (!auth?.user || !auth?.role || !auth?.token) {
//       const path = router.pathname;
//       const isNoAuthRequiredRoute = noAuthRequiredRoutes.includes(path);

//       if (!isNoAuthRequiredRoute) {
//         return null; // Prevent rendering anything until redirection
//       }
//     }

//     return <WrappedComponent {...props} />;
//   };
// };

// export default Auth;

import { useRouter } from "next/router";
import { useGlobalContext } from "@/context/userContext";
import React, { useEffect } from "react";

const Auth = (WrappedComponent) => {
  // Create a new functional component
  const AuthComponent = (props) => {
    const { auth, isAuthInitialized } = useGlobalContext();
    const router = useRouter();

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

  // Set a display name for the HOC for better debugging
  AuthComponent.displayName = `Auth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthComponent;
};

export default Auth;
