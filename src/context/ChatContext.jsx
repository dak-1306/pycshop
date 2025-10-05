import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChatWidget = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatWidget must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState(null);

  const openChat = (shopInfo = null) => {
    console.log('ChatContext: Opening chat with shop info:', shopInfo);
    setCurrentShop(shopInfo);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setCurrentShop(null);
  };

  const toggleChat = (shopInfo = null) => {
    if (isChatOpen) {
      closeChat();
    } else {
      openChat(shopInfo);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        currentShop,
        openChat,
        closeChat,
        toggleChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;