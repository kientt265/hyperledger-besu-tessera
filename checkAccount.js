const Web3 = require('web3').default;
const fs = require('fs');
const path = require('path');
const keythereum = require('keythereum');
const readline = require('readline');

// Initialize Web3 instance and account configuration
const web3 = new Web3('http://localhost:8545');
const account = '0x03535996ada33c4ccbc089c68b3a563cd780af25';
const keystoreDir = 'C:/besu-network/node1/data/keystore';

// Load keystore file based on the account address
const keystoreFile = fs.readdirSync(keystoreDir).find(file =>
  file.includes(account.slice(2).toLowerCase())
);

if (!keystoreFile) {
  console.error('Keystore file not found for the given account.');
  process.exit(1);
}

const keystorePath = path.join(keystoreDir, keystoreFile);

// Setup password prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

// Prompt for password securely
rl.question('Enter your password: ', (password) => {
  try {
    // Recover the private key from the keystore
    const keyObject = JSON.parse(fs.readFileSync(keystorePath, 'utf8'));
    const privateKey = keythereum.recover(password, keyObject).toString('hex');
    const privateKeyHex = `0x${privateKey}`;

    // Add account to Web3 wallet
    const accountObj = web3.eth.accounts.privateKeyToAccount(privateKeyHex);
    web3.eth.accounts.wallet.add(accountObj);

    // Check the balance of the account
    web3.eth.getBalance(account)
      .then(balance => {
        console.log('Account Balance (Ether):', web3.utils.fromWei(balance, 'ether'));
      })
      .catch(error => {
        console.error('Error fetching balance:', error);
      });

  } catch (error) {
    console.error('Error recovering the private key:', error);
  } finally {
    rl.close();
  }
});