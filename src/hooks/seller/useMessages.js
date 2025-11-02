import { useState, useEffect, useCallback } from "react";
import { messageService } from "../../lib/services/messageService";

export const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, use mock data. Replace with actual API call when backend is ready
      const response = messageService.getMockConversations();

      if (response.success) {
        setConversations(response.data);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      setError("Không thể tải danh sách tin nhắn");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load messages for specific conversation
  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    try {
      // For now, use mock data. Replace with actual API call when backend is ready
      const response = messageService.getMockMessages(conversationId);

      if (response.success) {
        setMessages(response.data);

        // Update unread count in conversations
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Không thể tải tin nhắn");
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (messageText, conversationId) => {
    if (!messageText.trim() || !conversationId) return false;

    setIsSending(true);
    setError(null);

    try {
      const messageData = {
        conversationId,
        senderId: "seller_1", // Mock seller ID for demo
        senderType: "seller",
        message: messageText,
        timestamp: new Date(),
      };

      // For now, simulate sending. Replace with actual API call when backend is ready
      const newMessage = {
        id: Date.now(),
        ...messageData,
        isRead: true,
      };

      // Add message to current conversation
      setMessages((prev) => [...prev, newMessage]);

      // Update last message in conversations
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: messageText,
                lastMessageTime: new Date(),
              }
            : conv
        )
      );

      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Không thể gửi tin nhắn");
      return false;
    } finally {
      setIsSending(false);
    }
  }, []);

  // Select conversation
  const selectConversation = useCallback(
    (conversation) => {
      setActiveConversation(conversation);
      loadMessages(conversation.id);
    },
    [loadMessages]
  );

  // Get unread count
  const getUnreadCount = useCallback(() => {
    return conversations.reduce(
      (total, conv) => total + (conv.unreadCount || 0),
      0
    );
  }, [conversations]);

  // Format time
  const formatTime = useCallback((date) => {
    if (!date) return "";

    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return messageDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Hôm qua";
    } else {
      return messageDate.toLocaleDateString("vi-VN");
    }
  }, []);

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId) => {
    try {
      // Update unread count in conversations
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, []);

  // Initialize - load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    // State
    conversations,
    activeConversation,
    messages,
    isLoading,
    isSending,
    error,

    // Actions
    loadConversations,
    loadMessages,
    sendMessage,
    selectConversation,
    markAsRead,

    // Utilities
    getUnreadCount,
    formatTime,

    // Setters
    setError,
    setActiveConversation,
  };
};
