const fs = require("fs");
const path = require("path");
const keythereum = require("keythereum");
const readline = require("readline");

//Revise this to your key file (of the account to deploy smart contract)
const keystoreFilePath = "C:\\besu-network\\node1\\data\\keystore\\UTC--2024-11-07T07-47-09.628675800Z--2bef6298f46817f7391a852dfc6669492ea72d90";
const envFilePath = path.join(__dirname, ".env");
const rpcUrl = "http://127.0.0.1:8545"; // Set your RPC URL here

async function promptForPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  return new Promise((resolve) => {
    rl.question("Enter your keystore password: ", (password) => {
      rl.close();
      resolve(password);
    });

    rl._writeToOutput = function _writeToOutput() {
      rl.output.write("*");
    };
  });
}

async function loadPrivateKey() {
  const password = await promptForPassword();
  if (!password) {
    throw new Error("Password not provided. Deployment aborted.");
  }

  const keyObject = JSON.parse(fs.readFileSync(keystoreFilePath, "utf8"));
  const privateKeyBuffer = keythereum.recover(password, keyObject);
  const privateKey = privateKeyBuffer.toString("hex").replace(/^0x/, "");

  const envContent = `PRIVATE_KEY=${privateKey}\nRPC_URL=${rpcUrl}\n`;
  fs.writeFileSync(envFilePath, envContent);

  console.log("\nPrivate key and RPC URL saved to .env file successfully.");
}

loadPrivateKey()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error loading private key:", error.message);
    process.exit(1);
  });