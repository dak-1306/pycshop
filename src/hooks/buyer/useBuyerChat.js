import { useState, useEffect, useCallback } from "react";
import ChatService from "../../services/chatService";
import chatWebSocketClient from "../../services/chatWebSocketClient";

export const useBuyerChat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Create new conversation with seller
  const createConversation = useCallback(async (sellerId) => {
    try {
      console.log(
        `[USE_BUYER_CHAT] Creating conversation with seller ${sellerId}`
      );
      const response = await ChatService.createConversation(sellerId);

      if (response.success) {
        console.log("[USE_BUYER_CHAT] ✅ Conversation created");
        // Reload conversations to get the new one
        await loadConversations();
        return response.conversationId;
      } else {
        setError(response.message || "Không thể tạo cuộc trò chuyện");
        return null;
      }
    } catch (error) {
      console.error("[USE_BUYER_CHAT] ❌ Error creating conversation:", error);
      setError("Không thể tạo cuộc trò chuyện");
      return null;
    }
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        "[USE_BUYER_CHAT] Loading conversations for buyer context..."
      );
      const response = await ChatService.getConversations("buyer");

      if (response.success) {
        // Transform backend data to frontend format
        const transformedConversations = response.conversations.map((conv) => ({
          id: conv.conversationId,
          sellerId: conv.partnerId,
          sellerName: conv.partnerName,
          sellerAvatar: conv.partnerAvatar,
          shopName: conv.partnerName, // Assuming seller name is shop name
          lastMessage: conv.lastMessage || "Chưa có tin nhắn",
          lastMessageTime: conv.lastMessageTime,
          unreadCount: conv.unreadCount || 0,
          isOnline: false, // Will be updated by socket
        }));

        setConversations(transformedConversations);
        console.log(
          "[USE_BUYER_CHAT] ✅ Loaded conversations:",
          transformedConversations.length
        );
      } else {
        setError(response.message || "Không thể tải danh sách tin nhắn");
      }
    } catch (error) {
      console.error("[USE_BUYER_CHAT] ❌ Error loading conversations:", error);
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
        `[USE_BUYER_CHAT] Loading messages for conversation ${conversationId}`
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
          `[USE_BUYER_CHAT] ✅ Loaded messages:`,
          transformedMessages.length
        );

        // Update unread count in conversations
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      } else {
        setError(response.message || "Không thể tải tin nhắn");
      }
    } catch (error) {
      console.error("[USE_BUYER_CHAT] ❌ Error loading messages:", error);
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
        `[USE_BUYER_CHAT] Sending message to conversation ${conversationId}`
      );
      const response = await ChatService.sendMessage(
        conversationId,
        messageText
      );

      console.log("[USE_BUYER_CHAT] Send message response:", response);

      if (response.success) {
        // Get current user info for the new message
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const currentUserId = (user.id || user.ID_NguoiDung)?.toString();
        const currentUserName = user.HoTen || user.name || "User";

        // Transform and add new message to current conversation
        const messageData = response.message || response.data || response;

        const newMessage = {
          id: messageData.messageId || response.messageId,
          content: messageText,
          senderId: (messageData.senderId || currentUserId)?.toString(),
          senderName: messageData.senderName || currentUserName,
          senderAvatar: messageData.senderAvatar || user.AvatarUrl || null,
          timestamp: messageData.sentAt || new Date().toISOString(),
          status: "delivered",
          type: "text",
        };

        console.log("[USE_BUYER_CHAT] New message created:", newMessage);

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

        console.log("[USE_BUYER_CHAT] ✅ Message sent successfully");
        return true;
      } else {
        setError(response.message || "Không thể gửi tin nhắn");
        return false;
      }
    } catch (error) {
      console.error("[USE_BUYER_CHAT] ❌ Error sending message:", error);
      setError("Không thể gửi tin nhắn");
      return false;
    } finally {
      setIsSending(false);
    }
  }, []);

  // Send image
  const sendImage = useCallback(async (imageFile, conversationId) => {
    if (!imageFile || !conversationId) return false;

    setIsSending(true);
    setError(null);

    try {
      console.log(
        `[USE_BUYER_CHAT] Sending image to conversation ${conversationId}`
      );
      const response = await ChatService.sendImage(conversationId, imageFile);

      if (response.success) {
        // Get current user info for the new message
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const currentUserId = (user.id || user.ID_NguoiDung)?.toString();
        const currentUserName = user.HoTen || user.name || "User";

        // Transform and add new message to current conversation
        const messageData = response.message || response.data || response;

        const newMessage = {
          id: messageData.messageId || response.messageId,
          content: messageData.imageUrl || messageData.content,
          senderId: (messageData.senderId || currentUserId)?.toString(),
          senderName: messageData.senderName || currentUserName,
          senderAvatar: messageData.senderAvatar || user.AvatarUrl || null,
          timestamp: messageData.sentAt || new Date().toISOString(),
          status: "delivered",
          type: "image",
        };

        setMessages((prev) => [...prev, newMessage]);

        // Update last message in conversations
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: "📷 Đã gửi hình ảnh",
                  lastMessageTime: newMessage.timestamp,
                }
              : conv
          )
        );

        console.log("[USE_BUYER_CHAT] ✅ Image sent successfully");
        return true;
      } else {
        setError(response.message || "Không thể gửi hình ảnh");
        return false;
      }
    } catch (error) {
      console.error("[USE_BUYER_CHAT] ❌ Error sending image:", error);
      setError("Không thể gửi hình ảnh");
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

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId) => {
    try {
      console.log(
        `[USE_BUYER_CHAT] Marking conversation ${conversationId} as read`
      );
      await ChatService.markAsRead(conversationId);

      // Update unread count in conversations
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );

      console.log("[USE_BUYER_CHAT] ✅ Marked as read");
    } catch (error) {
      console.error(
        "[USE_BUYER_CHAT] ❌ Error marking messages as read:",
        error
      );
    }
  }, []);

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
    } else {
      return messageDate.toLocaleDateString("vi-VN");
    }
  }, []);

  // WebSocket integration for real-time messages
  useEffect(() => {
    const handleNewMessage = (data) => {
      console.log("[USE_BUYER_CHAT] 💬 New message received:", data);

      // Get current user info to avoid duplicate messages
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = (user.id || user.ID_NguoiDung)?.toString();

      // Only add message if it's NOT from current user (to avoid duplicates)
      if (data.senderId.toString() !== currentUserId) {
        // Add message to current conversation if it matches
        if (
          activeConversation &&
          data.conversationId === activeConversation.id
        ) {
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

          // Check if message already exists to prevent duplicates
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === data.messageId);
            if (exists) {
              console.log(
                "[USE_BUYER_CHAT] Message already exists, skipping duplicate"
              );
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      } else {
        console.log("[USE_BUYER_CHAT] Skipping own message to avoid duplicate");
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
      console.log("[USE_BUYER_CHAT] 👁️ Message read:", data);

      // Update message status in current conversation
      if (activeConversation && data.conversationId === activeConversation.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId ? { ...msg, status: "read" } : msg
          )
        );
      }
    };

    const handleUserOnline = (data) => {
      console.log("[USE_BUYER_CHAT] 🟢 User online:", data);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.sellerId?.toString() === data.userId?.toString()
            ? { ...conv, isOnline: true }
            : conv
        )
      );
    };

    const handleUserOffline = (data) => {
      console.log("[USE_BUYER_CHAT] 🔴 User offline:", data);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.sellerId?.toString() === data.userId?.toString()
            ? { ...conv, isOnline: false }
            : conv
        )
      );
    };

    // Connect to chat WebSocket if not connected
    if (!chatWebSocketClient.isSocketConnected()) {
      console.log("[USE_BUYER_CHAT] Connecting to chat WebSocket...");
      chatWebSocketClient.connect();
    }

    // Setup event listeners
    chatWebSocketClient.on("new-message", handleNewMessage);
    chatWebSocketClient.on("message-read", handleMessageRead);
    chatWebSocketClient.on("user-online", handleUserOnline);
    chatWebSocketClient.on("user-offline", handleUserOffline);

    return () => {
      chatWebSocketClient.off("new-message", handleNewMessage);
      chatWebSocketClient.off("message-read", handleMessageRead);
      chatWebSocketClient.off("user-online", handleUserOnline);
      chatWebSocketClient.off("user-offline", handleUserOffline);
    };
  }, [activeConversation]);

  // Join/Leave conversation rooms when active conversation changes
  useEffect(() => {
    if (activeConversation?.id && chatWebSocketClient.isSocketConnected()) {
      console.log(
        `[USE_BUYER_CHAT] Joining conversation room: ${activeConversation.id}`
      );
      chatWebSocketClient.joinConversation(activeConversation.id);

      return () => {
        console.log(
          `[USE_BUYER_CHAT] Leaving conversation room: ${activeConversation.id}`
        );
        chatWebSocketClient.leaveConversation(activeConversation.id);
      };
    }
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
    createConversation,
    loadConversations,
    loadMessages,
    sendMessage,
    sendImage,
    selectConversation,
    markAsRead,

    // Utilities
    getUnreadCount,
    formatTime,
  };
};
