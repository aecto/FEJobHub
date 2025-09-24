const bcrypt = require('bcryptjs');

// 生成密码哈希
const password = 'your admin account password';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('Password hash for "your admin account password":');
  console.log(hash);
  
  // 输出INSERT语句
  console.log('\nMySQL INSERT statement:');
  console.log(`INSERT INTO users (username, email, password_hash, role, created_at) VALUES ('admin', 'admin@example.com', '${hash}', 'admin', NOW());`);
});