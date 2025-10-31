import React, { useState } from "react";
import { Button, IconButton, ActionButton } from "./index";

/**
 * ButtonShowcase - Demo component to showcase all button variants
 * This component can be used for testing and documentation
 */
const ButtonShowcase = () => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Button Components Showcase
        </h1>

        {/* Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
                className="mr-2"
              />
              Disabled State
            </label>
            <Button onClick={handleLoadingTest} size="sm">
              Test Loading (3s)
            </Button>
          </div>
        </div>

        {/* Basic Buttons by Role */}
        {["admin", "seller", "common"].map((role) => (
          <div key={role} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {role} Buttons
            </h2>

            {/* Variants */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Variants
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "primary",
                    "secondary",
                    "danger",
                    "success",
                    "warning",
                    "ghost",
                  ].map((variant) => (
                    <Button
                      key={variant}
                      variant={variant}
                      role={role}
                      disabled={disabled}
                      loading={loading}
                    >
                      {variant}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Sizes
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {["xs", "sm", "md", "lg", "xl"].map((size) => (
                    <Button
                      key={size}
                      size={size}
                      role={role}
                      disabled={disabled}
                      loading={loading}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  With Icons
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    role={role}
                    icon={["fas", "save"]}
                    disabled={disabled}
                    loading={loading}
                  >
                    Save
                  </Button>
                  <Button
                    role={role}
                    icon={["fas", "arrow-right"]}
                    iconPosition="right"
                    disabled={disabled}
                    loading={loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* IconButtons */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Icon Buttons</h2>
          <div className="space-y-4">
            {["admin", "seller", "common"].map((role) => (
              <div key={role}>
                <h3 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                  {role}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["xs", "sm", "md", "lg", "xl"].map((size) => (
                    <IconButton
                      key={size}
                      icon={["fas", "heart"]}
                      size={size}
                      role={role}
                      disabled={disabled}
                      tooltip={`${role} ${size} icon button`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ActionButtons */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Action Buttons</h2>
          <div className="space-y-4">
            {["admin", "seller", "common"].map((role) => (
              <div key={role}>
                <h3 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                  {role}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
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
                    "approve",
                    "reject",
                    "settings",
                  ].map((action) => (
                    <ActionButton
                      key={action}
                      action={action}
                      role={role}
                      size="sm"
                      disabled={disabled}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-world Examples */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Real-world Examples</h2>

          {/* Modal Footer */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Modal Footer - Admin
              </h3>
              <div className="flex justify-end space-x-4 p-4 bg-gray-50 rounded-lg">
                <ActionButton action="cancel" role="admin">
                  Hủy bỏ
                </ActionButton>
                <Button variant="primary" role="admin" icon={["fas", "save"]}>
                  Lưu thay đổi
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Modal Footer - Seller
              </h3>
              <div className="flex justify-end space-x-4 p-4 bg-gray-50 rounded-lg">
                <ActionButton action="cancel" role="seller">
                  Hủy bỏ
                </ActionButton>
                <Button variant="primary" role="seller" icon={["fas", "plus"]}>
                  Tạo sản phẩm
                </Button>
              </div>
            </div>

            {/* Toolbar */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Toolbar Actions
              </h3>
              <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                <ActionButton action="add" role="admin" size="sm">
                  Thêm mới
                </ActionButton>
                <IconButton
                  icon={["fas", "refresh"]}
                  role="admin"
                  size="sm"
                  tooltip="Refresh"
                />
                <IconButton
                  icon={["fas", "filter"]}
                  role="admin"
                  size="sm"
                  tooltip="Filter"
                />
                <ActionButton action="export" role="admin" size="sm" />
              </div>
            </div>

            {/* Table Actions */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Table Row Actions
              </h3>
              <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                <ActionButton action="view" role="admin" size="xs">
                  Xem
                </ActionButton>
                <ActionButton action="edit" role="admin" size="xs">
                  Sửa
                </ActionButton>
                <ActionButton action="delete" role="admin" size="xs">
                  Xóa
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;
