import React, { useState, createContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState(null);

  const openChat = (shopInfo = null) => {
    console.log("ChatContext: Opening chat with shop info:", shopInfo);
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

export { ChatContext };
