import { useState, useEffect } from "react";
import ShopService from "../../services/shopService";

export const useShopInfo = () => {
  const [shopInfo, setShopInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadShopInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ShopService.getShopInfo();
      if (response && response.shop) {
        setShopInfo(response.shop);
      }
    } catch (error) {
      console.error("Error loading shop info:", error);
      setError("Failed to load shop information");
      setShopInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShopInfo();
  }, []);

  return {
    shopInfo,
    isLoading,
    error,
    refetch: loadShopInfo,
  };
};
