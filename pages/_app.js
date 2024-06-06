import Header from "@/components/Header";
import { CartProvider } from "@/context/cartContext";
import { AppProvider } from "@/context/userContext";
import { WatchListProvider } from "@/context/watchListContext";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <CartProvider>
        <WatchListProvider>
          <Toaster />
          <Header />
          <Component {...pageProps} />
        </WatchListProvider>
      </CartProvider>
    </AppProvider>
  );
}
