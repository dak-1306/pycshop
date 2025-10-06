import { useCallback } from "react";
import { useAuth } from "./useAuth.js";

// Permissions configuration
const PERMISSIONS = {
  admin: {
    products: ["create", "read", "update", "delete"],
    orders: ["read", "update", "delete"],
    users: ["create", "read", "update", "delete"],
    categories: ["create", "read", "update", "delete"],
    settings: ["read", "update"],
    reports: ["read"],
  },
  seller: {
    products: ["create", "read", "update", "delete"], // Own products only
    orders: ["read", "update"], // Own orders only
    categories: ["read"],
    settings: ["read", "update"], // Own settings only
    reports: ["read"], // Own reports only
  },
  buyer: {
    orders: ["read"], // Own orders only
    settings: ["read", "update"], // Own settings only
  },
};

export const usePermissions = () => {
  const { user, hasRole } = useAuth();

  // Check if user can perform action on resource
  const canAccess = useCallback(
    (resource, action) => {
      if (!user || !user.role) {
        return false;
      }

      const rolePermissions = PERMISSIONS[user.role];
      if (!rolePermissions) {
        return false;
      }

      const resourcePermissions = rolePermissions[resource];
      if (!resourcePermissions) {
        return false;
      }

      return resourcePermissions.includes(action);
    },
    [user]
  );

  // Check if user can manage (full CRUD) resource
  const canManage = useCallback(
    (resource) => {
      if (!user || !user.role) {
        return false;
      }

      const rolePermissions = PERMISSIONS[user.role];
      if (!rolePermissions) {
        return false;
      }

      const resourcePermissions = rolePermissions[resource];
      if (!resourcePermissions) {
        return false;
      }

      // Check if user has all CRUD permissions
      const crudActions = ["create", "read", "update", "delete"];
      return crudActions.every((action) =>
        resourcePermissions.includes(action)
      );
    },
    [user]
  );

  // Check if user can access admin panel
  const canAccessAdmin = useCallback(() => {
    return hasRole("admin");
  }, [hasRole]);

  // Check if user can access seller panel
  const canAccessSeller = useCallback(() => {
    return hasRole("seller") || hasRole("admin");
  }, [hasRole]);

  // Get user permissions for a resource
  const getResourcePermissions = useCallback(
    (resource) => {
      if (!user || !user.role) {
        return [];
      }

      const rolePermissions = PERMISSIONS[user.role];
      if (!rolePermissions) {
        return [];
      }

      return rolePermissions[resource] || [];
    },
    [user]
  );

  // Get all user permissions
  const getAllPermissions = useCallback(() => {
    if (!user || !user.role) {
      return {};
    }

    return PERMISSIONS[user.role] || {};
  }, [user]);

  return {
    canAccess,
    canManage,
    canAccessAdmin,
    canAccessSeller,
    getResourcePermissions,
    getAllPermissions,
  };
};
