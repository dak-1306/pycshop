import React from "react";
import Button from "./Button";
import PropTypes from "prop-types";

/**
 * ActionButton - Pre-configured buttons for common actions
 */
const ActionButton = ({ action, role = "common", children, ...props }) => {
  const actionConfigs = {
    save: {
      variant: "success",
      icon: ["fas", "save"],
      defaultText: "Lưu",
    },
    delete: {
      variant: "danger",
      icon: ["fas", "trash"],
      defaultText: "Xóa",
    },
    edit: {
      variant: "primary",
      icon: ["fas", "edit"],
      defaultText: "Chỉnh sửa",
    },
    cancel: {
      variant: "secondary",
      icon: ["fas", "times"],
      defaultText: "Hủy bỏ",
    },
    add: {
      variant: "primary",
      icon: ["fas", "plus"],
      defaultText: "Thêm",
    },
    view: {
      variant: "ghost",
      icon: ["fas", "eye"],
      defaultText: "Xem",
    },
    export: {
      variant: "secondary",
      icon: ["fas", "download"],
      defaultText: "Xuất",
    },
    refresh: {
      variant: "ghost",
      icon: ["fas", "refresh"],
      defaultText: "Làm mới",
    },
    search: {
      variant: "primary",
      icon: ["fas", "search"],
      defaultText: "Tìm kiếm",
    },
    filter: {
      variant: "ghost",
      icon: ["fas", "filter"],
      defaultText: "Lọc",
    },
    back: {
      variant: "secondary",
      icon: ["fas", "arrow-left"],
      defaultText: "Quay lại",
    },
    next: {
      variant: "primary",
      icon: ["fas", "arrow-right"],
      defaultText: "Tiếp tục",
      iconPosition: "right",
    },
    upload: {
      variant: "primary",
      icon: ["fas", "upload"],
      defaultText: "Tải lên",
    },
    download: {
      variant: "secondary",
      icon: ["fas", "download"],
      defaultText: "Tải xuống",
    },
    approve: {
      variant: "success",
      icon: ["fas", "check"],
      defaultText: "Duyệt",
    },
    reject: {
      variant: "danger",
      icon: ["fas", "times"],
      defaultText: "Từ chối",
    },
    settings: {
      variant: "ghost",
      icon: ["fas", "cog"],
      defaultText: "Cài đặt",
    },
  };

  const config = actionConfigs[action] || actionConfigs.save;

  return (
    <Button {...config} role={role} {...props}>
      {children || config.defaultText}
    </Button>
  );
};

ActionButton.displayName = "ActionButton";

ActionButton.propTypes = {
  action: PropTypes.oneOf([
    "save",
    "delete",
    "edit",
    "cancel",
    "add",
    "view",
    "export",
    "refresh",
    "search",
    "filter",
    "back",
    "next",
    "upload",
    "download",
    "approve",
    "reject",
    "settings",
  ]).isRequired,
  role: PropTypes.oneOf(["admin", "seller", "common"]),
  children: PropTypes.node,
};

export default ActionButton;
