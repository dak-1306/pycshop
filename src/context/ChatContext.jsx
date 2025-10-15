import React, { createContext, useContext } from "react";
import { useChatWidget } from "../hooks/ui/useChatWidget";

// Create Chat Context
const ChatContext = createContext();

// Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Chat Provider Component
export const ChatProvider = ({ children }) => {
  const chatWidget = useChatWidget();

  return (
    <ChatContext.Provider value={chatWidget}>{children}</ChatContext.Provider>
  );
};
