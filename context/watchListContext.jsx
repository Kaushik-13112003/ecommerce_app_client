const { createContext, useState, useEffect } = require("react");

const WatchListContext = createContext();

const WatchListProvider = ({ children }) => {
  const [productIds, setProductIds] = useState([]);

  const addProductToWatchList = (product_id) => {
    let allWatchListProductsIds;

    if (productIds.includes(product_id)) {
      allWatchListProductsIds = productIds.filter((pid) => pid !== product_id);
    } else {
      allWatchListProductsIds = [...productIds, product_id];
    }
    setProductIds(allWatchListProductsIds);
    if (allWatchListProductsIds) {
      localStorage.setItem(
        "watchList",
        JSON.stringify(allWatchListProductsIds)
      );
    }
  };

  useEffect(() => {
    let getWatchListProductsIds = localStorage.getItem("watchList");

    if (getWatchListProductsIds) {
      try {
        let parseData = JSON.parse(getWatchListProductsIds);

        if (Array.isArray(parseData)) {
          setProductIds(parseData);
        }
      } catch (err) {
        console.error("Failed to parse watchList from localStorage", e);
      }
    }
  }, []);

  return (
    <WatchListContext.Provider
      value={{
        productIds,
        setProductIds,
        addProductToWatchList,
      }}
    >
      {children}
    </WatchListContext.Provider>
  );
};

export { WatchListContext, WatchListProvider };
