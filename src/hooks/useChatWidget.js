import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

export const useChatWidget = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatWidget must be used within a ChatProvider");
  }
  return context;
};
