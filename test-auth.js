import mysql from 'mysql2/promise';

const testConnection = async () => {
  try {
    console.log('🔍 Testing MySQL connection...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'pycshop'
    });
    
    console.log('✅ MySQL connected!');
    
    // Check if users table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.log('❌ Table "users" không tồn tại!');
      console.log('📝 Bạn cần import database từ: microservice/db/pycshop.sql');
      console.log('   1. Mở http://localhost/phpmyadmin');
      console.log('   2. Tạo database "pycshop"');
      console.log('   3. Import file pycshop.sql');
    } else {
      console.log('✅ Table "users" exists');
      
      // Check users count
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      console.log(`📊 Có ${users[0].count} users trong database`);
      
      if (users[0].count === 0) {
        console.log('⚠️  Database rỗng, cần import dữ liệu mẫu');
      } else {
        // Show sample users
        const [sampleUsers] = await connection.query('SELECT email, role FROM users LIMIT 5');
        console.log('👥 Sample users:');
        sampleUsers.forEach(user => {
          console.log(`   - ${user.email} (${user.role})`);
        });
      }
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('💡 Giải pháp:');
      console.log('   1. Mở XAMPP Control Panel');
      console.log('   2. Click "Start" bên cạnh MySQL');
      console.log('   3. Chờ đèn xanh');
      console.log('   4. Chạy lại script này');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('');
      console.log('💡 Database "pycshop" chưa tồn tại!');
      console.log('   1. Mở http://localhost/phpmyadmin');
      console.log('   2. Click "New" để tạo database');
      console.log('   3. Đặt tên: pycshop');
      console.log('   4. Click "Import" và chọn file microservice/db/pycshop.sql');
    }
  }
};

testConnection();
