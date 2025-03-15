const keythereum = require('keythereum');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Thay đổi địa chỉ tài khoản và thư mục keystore của bạn
const account = '0x2BEF6298f46817f7391A852dfc6669492Ea72d90'; // Địa chỉ tài khoản Ethereum của bạn
const keystoreDir = 'C:/besu-network/node1/data/keystore'; // Đường dẫn đến thư mục chứa các tệp keystore của bạn

// Tìm kiếm tệp keystore cho tài khoản
const keystoreFile = fs.readdirSync(keystoreDir).find(file =>
  file.includes(account.slice(2).toLowerCase()) // Đảm bảo tìm đúng tệp keystore của tài khoản
);
const keystorePath = path.join(keystoreDir, keystoreFile);

// Tạo giao diện nhập mật khẩu bảo mật
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

// Ẩn đầu ra mật khẩu khi người dùng nhập
rl.question('Enter your password to unlock the account: ', (password) => {
  try {
    // Đọc tệp keystore và giải mã private key từ mật khẩu
    const keyObject = JSON.parse(fs.readFileSync(keystorePath));
    const privateKeyBuffer = keythereum.recover(password, keyObject);

    // In ra private key (dưới dạng hexadecimal)
    console.log(`Private Key: 0x${privateKeyBuffer.toString('hex')}`);

  } catch (error) {
    console.error('Error recovering the private key:', error);
  } finally {
    rl.close();
  }
});
