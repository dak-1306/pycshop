import { useState, useEffect, useCallback } from "react";
import ChatService from "../../services/chatService";
import webSocketClient from "../../services/webSocketClient";

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
      console.log("[USE_MESSAGES] Loading conversations for seller context...");
      const response = await ChatService.getConversations('seller');

      if (response.success) {
        // Transform backend data to frontend format
        const transformedConversations = response.conversations.map((conv) => ({
          id: conv.conversationId,
          customerId: conv.partnerId,
          customerName: conv.partnerName,
          customerAvatar: conv.partnerAvatar,
          lastMessage: conv.lastMessage || "Chưa có tin nhắn",
          lastMessageTime: conv.lastMessageTime,
          unreadCount: conv.unreadCount || 0,
          isOnline: false, // Will be updated by socket
        }));

        setConversations(transformedConversations);
        console.log(
          "[USE_MESSAGES] ✅ Loaded conversations:",
          transformedConversations.length
        );
      } else {
        setError(response.message || "Không thể tải danh sách tin nhắn");
      }
    } catch (error) {
      console.error("[USE_MESSAGES] ❌ Error loading conversations:", error);
      setError("Không thể tải danh sách tin nhắn");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load messages for specific conversation
  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    try {
      console.log(
        `[USE_MESSAGES] Loading messages for conversation ${conversationId}`
      );
      const response = await ChatService.getMessages(conversationId);

      if (response.success) {
        // Transform backend data to frontend format
        const transformedMessages =
          response.messages?.map((msg) => ({
            id: msg.messageId,
            content: msg.content,
            senderId: msg.senderId.toString(),
            senderName: msg.senderName,
            senderAvatar: msg.senderAvatar,
            timestamp: msg.timestamp,
            status: msg.isRead ? "read" : "delivered",
            type: msg.type || "text",
          })) || [];

        setMessages(transformedMessages);
        console.log(
          `[USE_MESSAGES] ✅ Loaded messages:`,
          transformedMessages.length
        );

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
      console.log(
        `[USE_MESSAGES] Sending message to conversation ${conversationId}`
      );
      const response = await ChatService.sendMessage(
        conversationId,
        messageText
      );

      if (response.success) {
        // Transform and add new message to current conversation
        const newMessage = {
          id: response.messageId || response.data?.messageId,
          content: messageText,
          senderId: (
            response.senderId ||
            response.data?.senderId ||
            response.userId
          )?.toString(),
          senderName: response.senderName || response.data?.senderName,
          senderAvatar: response.senderAvatar || response.data?.senderAvatar,
          timestamp:
            response.timestamp ||
            response.data?.timestamp ||
            new Date().toISOString(),
          status: "delivered",
          type: "text",
        };

        setMessages((prev) => [...prev, newMessage]);

        // Update last message in conversations
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: messageText,
                  lastMessageTime: newMessage.timestamp,
                }
              : conv
          )
        );

        console.log("[USE_MESSAGES] ✅ Message sent successfully");
        return true;
      } else {
        setError(response.message || "Không thể gửi tin nhắn");
        return false;
      }
    } catch (error) {
      console.error("[USE_MESSAGES] ❌ Error sending message:", error);
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
      console.log(
        `[USE_MESSAGES] Marking conversation ${conversationId} as read`
      );
      await ChatService.markAsRead(conversationId);

      // Update unread count in conversations
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );

      console.log("[USE_MESSAGES] ✅ Marked as read");
    } catch (error) {
      console.error("[USE_MESSAGES] ❌ Error marking messages as read:", error);
    }
  }, []);

  // Initialize - load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // WebSocket integration for real-time messages
  useEffect(() => {
    const handleNewMessage = (data) => {
      console.log("[USE_MESSAGES] 💬 New message received:", data);

      // Add message to current conversation if it matches
      if (activeConversation && data.conversationId === activeConversation.id) {
        const newMessage = {
          id: data.messageId,
          content: data.content,
          senderId: data.senderId.toString(),
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          timestamp: data.timestamp,
          status: "delivered",
          type: data.type || "text",
        };

        setMessages((prev) => [...prev, newMessage]);
      }

      // Update last message in conversations
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === data.conversationId
            ? {
                ...conv,
                lastMessage: data.content,
                lastMessageTime: data.timestamp,
                unreadCount:
                  activeConversation?.id === data.conversationId
                    ? 0
                    : (conv.unreadCount || 0) + 1,
              }
            : conv
        )
      );
    };

    const handleMessageRead = (data) => {
      console.log("[USE_MESSAGES] 👁️ Message read:", data);

      // Update message status in current conversation
      if (activeConversation && data.conversationId === activeConversation.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId ? { ...msg, status: "read" } : msg
          )
        );
      }
    };

    // Setup WebSocket listeners
    if (webSocketClient.isSocketConnected()) {
      webSocketClient.on("new-message", handleNewMessage);
      webSocketClient.on("message-read", handleMessageRead);
    } else {
      webSocketClient.connect();
      webSocketClient.on("new-message", handleNewMessage);
      webSocketClient.on("message-read", handleMessageRead);
    }

    return () => {
      webSocketClient.off("new-message", handleNewMessage);
      webSocketClient.off("message-read", handleMessageRead);
    };
  }, [activeConversation]);

  return {
    // State
    conversations,
    activeConversation,
    messages,
    isLoading,
    isSending,
    error,
    hasError: !!error,

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
