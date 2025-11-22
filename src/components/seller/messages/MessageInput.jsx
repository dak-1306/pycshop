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
    <div className="px-4 py-4">
      {/* Quick reply suggestions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {[
          "Cảm ơn bạn đã liên hệ!",
          "Sản phẩm hiện đang còn hàng",
          "Bạn có thể cho tôi thêm thông tin?",
          "Tôi sẽ kiểm tra và phản hồi lại",
        ].map((quickReply, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setMessage(quickReply)}
            className="px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150 border border-gray-200"
          >
            {quickReply}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Message input */}
        <div className="flex-1 relative">
          <div className="relative bg-white rounded-lg border border-gray-300 focus-within:border-blue-500 transition-colors duration-150">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={disabled ? "Không thể gửi tin nhắn" : placeholder}
              disabled={disabled || isSending}
              rows={1}
              className="w-full px-3 py-2.5 pr-20 bg-transparent border-0 rounded-lg resize-none focus:outline-none placeholder-gray-400 text-gray-900 text-sm"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />

            {/* Quick actions */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
                title="Thêm emoji"
                disabled={disabled}
              >
                <FontAwesomeIcon icon={["fas", "smile"]} className="text-sm" />
              </button>
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-150"
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
            w-10 h-10 rounded-lg transition-colors duration-150 flex items-center justify-center flex-shrink-0
            ${
              message.trim() && !disabled && !isSending
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
          title={isSending ? "Đang gửi..." : "Gửi tin nhắn (Enter)"}
        >
          {isSending ? (
            <FontAwesomeIcon
              icon={["fas", "spinner"]}
              className="animate-spin text-sm"
            />
          ) : (
            <FontAwesomeIcon
              icon={["fas", "paper-plane"]}
              className="text-sm"
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
