import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MessageInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Nhập tin nhắn...",
  isSending = false,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    try {
      await onSendMessage(trimmedMessage);
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        {/* Message input */}
        <div className="flex-1 relative">
          <div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100 transition-all">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={disabled ? "Không thể gửi tin nhắn" : placeholder}
              disabled={disabled || isSending}
              rows={1}
              className="w-full px-4 py-3 bg-transparent border-0 rounded-2xl resize-none focus:outline-none placeholder-gray-500 text-gray-900"
              style={{ minHeight: "52px", maxHeight: "120px" }}
            />

            {/* Character count */}
            {message.length > 100 && (
              <div className="absolute bottom-2 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                {message.length}/500
              </div>
            )}

            {/* Quick actions inside input */}
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                title="Thêm emoji"
                disabled={disabled}
              >
                <FontAwesomeIcon icon={["fas", "smile"]} className="text-sm" />
              </button>
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                title="Đính kèm file"
                disabled={disabled}
              >
                <FontAwesomeIcon
                  icon={["fas", "paperclip"]}
                  className="text-sm"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled || isSending}
          className={`
            w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center font-medium
            ${
              message.trim() && !disabled && !isSending
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
          title={isSending ? "Đang gửi..." : "Gửi tin nhắn (Enter)"}
        >
          {isSending ? (
            <FontAwesomeIcon
              icon={["fas", "spinner"]}
              className="animate-spin text-lg"
            />
          ) : (
            <FontAwesomeIcon
              icon={["fas", "paper-plane"]}
              className="text-lg"
            />
          )}
        </button>
      </form>
    </div>
  );
};

MessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  isSending: PropTypes.bool,
};

export default MessageInput;
