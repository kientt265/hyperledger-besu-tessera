const keythereum = require('keythereum');
const ethUtil = require('ethereumjs-util');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Địa chỉ tài khoản và thư mục chứa keystore
const account = '0xF3c7C0Acc69A8bBf3D91D2b46DcBCff1d83599fc'; // Thay bằng địa chỉ tài khoản của bạn
const keystoreDir = 'C:/besu-network/node2/data/keystore'; // Thư mục chứa keystore

// Tìm kiếm tệp keystore chứa tài khoản bạn muốn unlock
const keystoreFile = fs.readdirSync(keystoreDir).find(file =>
  file.includes(account.slice(2).toLowerCase())
);
const keystorePath = path.join(keystoreDir, keystoreFile);

// Tạo giao diện để nhập mật khẩu
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

rl.question('Enter your password: ', (password) => {
  try {
    // Đọc tệp keystore và giải mã private key từ mật khẩu
    const keyObject = JSON.parse(fs.readFileSync(keystorePath));
    const privateKeyBuffer = keythereum.recover(password, keyObject);

    // Hiển thị private key (dưới dạng hex)
    console.log('Private Key: 0x' + privateKeyBuffer.toString('hex'));

  } catch (error) {
    console.error('Error recovering the private key:', error);
  } finally {
    rl.close();
  }
});
