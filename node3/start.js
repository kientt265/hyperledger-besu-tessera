const { exec } = require('child_process');
const keythereum = require('keythereum');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Writable } = require('stream');

// Revise to your keystore path and validator account address
const account = '0x85fD0425ba8A2b8b0D32A3788dA375Dd269EC9b9';
const keystoreDir = 'C:\\besu-network\\node3\\data\\keystore';

// Locate the keystore file for the account
console.log('Locating keystore file...');
const keystoreFile = fs.readdirSync(keystoreDir).find(file =>
  file.includes(account.slice(2).toLowerCase())
);

if (!keystoreFile) {
  console.error('Error: Keystore file not found for the specified account.');
  process.exit(1);
}

const keystorePath = path.join(keystoreDir, keystoreFile);
console.log(`Keystore file located at: ${keystorePath}`);

// Prompt for password securely
const mutableStdout = new Writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted) process.stdout.write(chunk, encoding);
    callback();
  }
});
mutableStdout.muted = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
});

console.log('Enter your password: ');
mutableStdout.muted = true;

rl.question('', (password) => {
  mutableStdout.muted = false;
  rl.close();

  try {
    console.log('Reading keystore file and recovering private key...');
    // Recover the private key from the keystore
    const keyObject = JSON.parse(fs.readFileSync(keystorePath));
    const privateKey = keythereum.recover(password, keyObject);

    // Convert the private key to a hex string and store it in a temporary file
    const tempPrivateKeyFilePath = path.join(require('os').tmpdir(), 'temp-private-key.key');
    fs.writeFileSync(tempPrivateKeyFilePath, privateKey.toString('hex'));
    console.log('Private key recovered successfully and stored in a temporary file.');

    console.log('Starting Besu node...');
    // Revise this to your node1-config.toml and genesis.json paths
    const besuCommand = `besu --config-file=C:/besu-network/node3/node3-config.toml --node-private-key-file="${tempPrivateKeyFilePath}" --network-id=1337 --genesis-file=C:/besu-network/genesis.json`;
    console.log(`Executing command: ${besuCommand}`);

    const besuProcess = exec(besuCommand, { shell: true });

    besuProcess.stdout.on('data', (data) => {
      console.log(`Besu Output: ${data}`);
    });

    besuProcess.stderr.on('data', (data) => {
      console.error(`Besu Error: ${data}`);
    });

    besuProcess.on('close', (code) => {
      console.log(`Besu process exited with code ${code}`);
      // Remove the temporary file after the process
      fs.unlinkSync(tempPrivateKeyFilePath);
      console.log('Temporary private key file removed.');
    });

  } catch (error) {
    console.error('Error recovering the private key:', error);
  }
});