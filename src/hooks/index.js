// API Hooks
export { useProducts } from "./api/useProducts.js";
export { useOrders } from "./api/useOrders.js";
export { useUsers } from "./api/useUsers.js";
export { useCategories } from "./api/useCategories.js";

// Auth Hooks
export { useAuth } from "./auth/useAuth.js";
export { usePermissions } from "./auth/usePermissions.js";
export { useAdminLogin } from "./auth/useAdminLogin.js";

// User Hooks
export { useProfile } from "./user/useProfile.js";

// UI Hooks
export { useDashboard } from "./ui/useDashboard.js";
export { useNotifications } from "./ui/useNotifications.js";
export { useChatWidget } from "./useChatWidget.js";

// Utility Hooks
export {
  useModal,
  useConfirmModal,
  useForm,
  useLocalStorage,
} from "../utils/useUI.js";

export {
  useDebounce,
  useToggle,
  usePrevious,
  useClickOutside,
  useKeyPress,
  useWindowSize,
  useScrollPosition,
  useMediaQuery,
  useCopyToClipboard,
  useInterval,
  useTimeout,
  useArray,
} from "../utils/useHelpers.js";
