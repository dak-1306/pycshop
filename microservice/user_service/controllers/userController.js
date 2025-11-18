import UserModel from "../models/UserModel.js";

class UserController {
  // [GET] /api/users/profile
  // Lấy thông tin profile của user
  static async getUserProfile(req, res) {
    try {
      const userId = req.headers["x-user-id"];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Vui lòng đăng nhập để truy cập thông tin",
        });
      }

      console.log(`[USER_CONTROLLER] Getting profile for user ${userId}`);

      const profile = await UserModel.getUserById(userId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin người dùng",
        });
      }

      res.json({
        success: true,
        data: {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          avatar: profile.avatar,
        },
        message: "Lấy thông tin người dùng thành công",
      });
    } catch (error) {
      console.error("[USER_CONTROLLER] Error getting user profile:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy thông tin người dùng",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // [GET] /api/users/addresses
  // Lấy danh sách địa chỉ của user
  static async getUserAddresses(req, res) {
    try {
      const userId = req.headers["x-user-id"];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Vui lòng đăng nhập để truy cập địa chỉ",
        });
      }

      console.log(`[USER_CONTROLLER] Getting addresses for user ${userId}`);

      const result = await UserModel.getUserAddresses(userId);
      console.log("User addresses result:", result);

      res.json({
        success: true,
        data: {
          addresses: result.address,
          name: result.name,
          phone: result.phone,
        },
        message: "Lấy danh sách địa chỉ thành công",
      });
    } catch (error) {
      console.error("[USER_CONTROLLER] Error getting user addresses:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy danh sách địa chỉ",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  //   // [GET] /api/users/addresses/default
  //   // Lấy địa chỉ mặc định cho checkout
  //   static async getDefaultAddress(req, res) {
  //     try {
  //       const userId = req.headers["x-user-id"];

  //       if (!userId) {
  //         return res.status(401).json({
  //           success: false,
  //           message: "Vui lòng đăng nhập để truy cập địa chỉ",
  //         });
  //       }

  //       console.log(
  //         `[USER_CONTROLLER] Getting default address for user ${userId}`
  //       );

  //       const defaultAddress = await UserModel.getDefaultAddress(userId);

  //       if (!defaultAddress) {
  //         return res.json({
  //           success: true,
  //           data: null,
  //           message: "Chưa có địa chỉ mặc định. Vui lòng thêm địa chỉ mới.",
  //         });
  //       }

  //       res.json({
  //         success: true,
  //         data: {
  //           id: defaultAddress.ID_DiaChi,
  //           name: defaultAddress.name,
  //           phone: defaultAddress.phone,
  //           street: defaultAddress.street,
  //           ward: defaultAddress.ward,
  //           district: defaultAddress.district,
  //           city: defaultAddress.city,
  //           isDefault: Boolean(defaultAddress.isDefault),
  //         },
  //         message: "Lấy địa chỉ mặc định thành công",
  //       });
  //     } catch (error) {
  //       console.error("[USER_CONTROLLER] Error getting default address:", error);
  //       res.status(500).json({
  //         success: false,
  //         message: "Lỗi hệ thống khi lấy địa chỉ mặc định",
  //         error:
  //           process.env.NODE_ENV === "development" ? error.message : undefined,
  //       });
  //     }
  //   }

  // [GET] /api/users/health
  // Health check endpoint
  static async healthCheck(req, res) {
    res.json({
      success: true,
      service: "User Service",
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "User service đang hoạt động bình thường",
    });
  }
}

export default UserController;
