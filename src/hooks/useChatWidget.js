import { useState, useCallback } from "react";

/**
 * Custom hook for managing global chat widget state
 * Handles opening/closing chat and managing current shop context
 */
export const useChatWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState(null);

  // Open chat with optional shop context
  const openChat = useCallback((shopData = null) => {
    console.log("Opening chat with shop data:", shopData);
    setIsChatOpen(true);
    if (shopData) {
      setCurrentShop(shopData);
    }
  }, []);

  // Close chat and reset shop context
  const closeChat = useCallback(() => {
    console.log("Closing chat");
    setIsChatOpen(false);
    setCurrentShop(null);
  }, []);

  // Toggle chat visibility
  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  return {
    isChatOpen,
    currentShop,
    openChat,
    closeChat,
    toggleChat,
  };
};
