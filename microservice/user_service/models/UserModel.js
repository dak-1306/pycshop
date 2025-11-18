import smartDB from "../../db/index.js";

class UserModel {
  // Lấy thông tin user từ database
  static async getUserById(userId) {
    try {
      const query = `
        SELECT 
          HoTen as name,
          Email as email,
          SoDienThoai as phone,
          DiaChi as address,
          AvatarUrl as avatar
        FROM nguoidung 
        WHERE ID_NguoiDung = ?
      `;

      const [result] = await smartDB.executeRead(query, [userId]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("[USER_MODEL] Error getting user by ID:", error);
      throw error;
    }
  }

  // Lấy địa chỉ chi tiết từ bảng diachinguoidung
  static async getUserAddresses(userId) {
    try {
      const query = `
          SELECT
            HoTen as name,
            SoDienThoai as phone,
            DiaChi as address
          FROM nguoidung
          WHERE ID_NguoiDung = ?
        `;

      const [result] = await smartDB.executeRead(query, [userId]);
      return result[0];
    } catch (error) {
      console.error("[USER_MODEL] Error getting user addresses:", error);
      throw error;
    }
  }

  //   // Lấy địa chỉ mặc định cho checkout
  //   static async getDefaultAddress(userId) {
  //     try {
  //       const query = `
  //         SELECT
  //           ID_DiaChi,
  //           HoTen as name,
  //           SoDienThoai as phone,
  //           DiaChi as street,
  //           Phuong as ward,
  //           Quan as district,
  //           ThanhPho as city,
  //           MacDinh as isDefault
  //         FROM diachinguoidung
  //         WHERE ID_NguoiDung = ? AND MacDinh = 1
  //         LIMIT 1
  //       `;

  //       const [result] = await smartDB.executeRead(query, [userId]);
  //       return result.length > 0 ? result[0] : null;
  //     } catch (error) {
  //       console.error("[USER_MODEL] Error getting default address:", error);
  //       throw error;
  //     }
  //   }
}

export default UserModel;
