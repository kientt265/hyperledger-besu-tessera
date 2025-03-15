const keythereum = require('keythereum');
const ethUtil = require('ethereumjs-util');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');

// Revise to your keystore path and validator account address
const account = '0x2BEF6298f46817f7391A852dfc6669492Ea72d90';
const keystoreDir = 'C:/besu-network/node1/data/keystore';


// Locate the keystore file for the account
const keystoreFile = fs.readdirSync(keystoreDir).find(file =>
  file.includes(account.slice(2).toLowerCase())
);
const keystorePath = path.join(keystoreDir, keystoreFile);

// Prompt for password securely, hiding the input
const mutableStdout = new Writable({
  write: function (chunk, encoding, callback) {
    if (!rl.hidden) {
      process.stdout.write(chunk, encoding);
    }
    callback();
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
});

console.log('To unlock your account, please enter your password.');
rl.hidden = true;

rl.question('Enter your password: ', (password) => {
  try {
    // Recover the private key from the keystore and store it as a Buffer
    const keyObject = JSON.parse(fs.readFileSync(keystorePath));
    const privateKeyBuffer = keythereum.recover(password, keyObject);

    // Extract the public key from the private key Buffer
    const publicKeyBuffer = ethUtil.privateToPublic(privateKeyBuffer);
    const publicAddress = `0x${ethUtil.pubToAddress(publicKeyBuffer, true).toString('hex')}`;

    console.log('\nAccount unlocked successfully!');
    console.log(`Public Key: 0x${publicKeyBuffer.toString('hex')}`);
    console.log(`Public Address: ${publicAddress}`);

    // You can now use `privateKeyBuffer` for further operations
    // e.g., signing transactions, generating other cryptographic elements, etc.

  } catch (error) {
    console.error('\nError recovering the private key:', error);
  } finally {
    rl.close();
  }
});