import db from "../../db/index.js";

class Seller {
  static async create(sellerData) {
    const {
      userId,
      shopName,
      shopDescription,
      shopCategory,
      shopAddress,
      shopPhone,
      status = "active",
    } = sellerData;

    const query = `
      INSERT INTO Seller (
        ID_NguoiDung,
        TenShop,
        MoTaShop,
        DanhMucShop,
        DiaChiShop,
        SoDienThoaiShop,
        TrangThai
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      userId,
      shopName,
      shopDescription,
      shopCategory,
      shopAddress,
      shopPhone,
      status,
    ]);

    return result;
  }

  static async findByUserId(userId) {
    const query = `
      SELECT 
        s.*,
        n.HoTen,
        n.Email
      FROM Seller s
      JOIN NguoiDung n ON s.ID_NguoiDung = n.ID_NguoiDung
      WHERE s.ID_NguoiDung = ?
    `;

    const [rows] = await db.execute(query, [userId]);
    return rows[0] || null;
  }

  static async findById(sellerId) {
    const query = `
      SELECT 
        s.*,
        n.HoTen,
        n.Email
      FROM Seller s
      JOIN NguoiDung n ON s.ID_NguoiDung = n.ID_NguoiDung
      WHERE s.ID_Seller = ?
    `;

    const [rows] = await db.execute(query, [sellerId]);
    return rows[0] || null;
  }

  static async updateStatus(sellerId, status) {
    const query = `
      UPDATE Seller 
      SET TrangThai = ?, NgayCapNhat = CURRENT_TIMESTAMP
      WHERE ID_Seller = ?
    `;

    const [result] = await db.execute(query, [status, sellerId]);
    return result;
  }

  static async update(sellerId, sellerData) {
    const { shopName, shopDescription, shopCategory, shopAddress, shopPhone } =
      sellerData;

    const query = `
      UPDATE Seller 
      SET 
        TenShop = ?,
        MoTaShop = ?,
        DanhMucShop = ?,
        DiaChiShop = ?,
        SoDienThoaiShop = ?,
        NgayCapNhat = CURRENT_TIMESTAMP
      WHERE ID_Seller = ?
    `;

    const [result] = await db.execute(query, [
      shopName,
      shopDescription,
      shopCategory,
      shopAddress,
      shopPhone,
      sellerId,
    ]);

    return result;
  }

  static async getAll(limit = 10, offset = 0) {
    const query = `
      SELECT 
        s.*,
        n.HoTen,
        n.Email
      FROM Seller s
      JOIN NguoiDung n ON s.ID_NguoiDung = n.ID_NguoiDung
      ORDER BY s.NgayTao DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.execute(query, [limit, offset]);
    return rows;
  }

  static async searchByCategory(category, limit = 10, offset = 0) {
    const query = `
      SELECT 
        s.*,
        n.HoTen,
        n.Email
      FROM Seller s
      JOIN NguoiDung n ON s.ID_NguoiDung = n.ID_NguoiDung
      WHERE s.DanhMucShop = ? AND s.TrangThai = 'active'
      ORDER BY s.NgayTao DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.execute(query, [category, limit, offset]);
    return rows;
  }

  static async searchByName(shopName, limit = 10, offset = 0) {
    const query = `
      SELECT 
        s.*,
        n.HoTen,
        n.Email
      FROM Seller s
      JOIN NguoiDung n ON s.ID_NguoiDung = n.ID_NguoiDung
      WHERE s.TenShop LIKE ? AND s.TrangThai = 'active'
      ORDER BY s.NgayTao DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.execute(query, [`%${shopName}%`, limit, offset]);
    return rows;
  }
}

export default Seller;
