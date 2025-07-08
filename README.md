# Setting Up a Private Besu Network with 4 Nodes - Detailed Guide

This guide details the key steps to set up a private Besu blockchain network with four nodes, verify the network and accounts, and deploy smart contracts.

## Step 0: Setup Prerequisites

```cmd
npm install -g geth
```

## Step 1: Generate Validator Accounts and Configure Genesis.json

## Step 1.1: Directory Structure

- Create the following structure:

  ```sh
  besu-network/
    |-- node1/
    |-- node2/
    |-- node3/
    |-- node4/
    |-- genesis.json
    |-- static-nodes.json
  ```

  - **node1, node2, node3, node4**: Directories for each node's data.
  - **genesis.json**: Defines network parameters (initial block).
  - **static-nodes.json**: Contains information for nodes to connect to each other (peer list).


### Step 1.2: Generate Validator Accounts

1. **Open Command Prompt** (Windows) and navigate to the Besu binary folder:

   ```cmd
   cd path\to\besu\bin
   ```

2. **Generate a validator account**:

   ```cmd
   geth account new --datadir "C:\besu-network\node1\data"
   geth account new --datadir "C:\besu-network\node2\data"
   geth account new --datadir "C:\besu-network\node3\data"
   geth account new --datadir "C:\besu-network\node4\data"
   ```

   - You will see an output with the **public address** of the account (e.g., `0x03535996AdA33C4Ccbc089C68b3A563Cd780aF25`).

3. **Repeat this process** to create additional validator accounts as needed. Save the generated addresses (you'll need them for `genesis.json`).

---

### Step 1.2: Prepare the `extraData` Field

The **`extraData` field** in the `genesis.json` file contains:

1. **32 bytes of zero padding** (vanity data, 0x + 64 hex characters).
2. **List of validator addresses** (without the `0x` prefix).
3. **Add bytes of zero padding**.
4. **Total: 0x + 194 hex characters (97 bytes)**

#### Example

If your generated validator addresses are:

- `0x03535996AdA33C4Ccbc089C68b3A563Cd780aF25`
- `0xA4bcDa746d5Fde1f4bC86415a2daA49a6EEe903F`

The `extraData` will look like this:

```
0x0000000000000000000000000000000000000000000000000000000000000000
03535996AdA33C4Ccbc089C68b3A563Cd780aF25
A4bcDa746d5Fde1f4bC86415a2daA49a6EEe903F
00000000000000000000000000000000000000000000000000
```

### Step 1.4: Create the `genesis.json` File

Once the accounts are generated and the `extraData` is prepared, create the `genesis.json` file:

```json
{
    "config": {
        "chainId": 1337,
        "constantinopleBlock": 0,
        "clique": {
            "period": 5,
            "epoch": 30000
        },
        "ibft2": {
            "blockperiodseconds": 5,
            "epochlength": 30000,
            "requesttimeoutseconds": 10,
            "faulttolerance": 0.667
        }
    },
    "alloc": {
        "0x03535996ada33c4ccbc089c68b3a563cd780af25": { "balance": "1000000000000000000000" },
        "0xA4bcDa746d5Fde1f4bC86415a2daA49a6EEe903F": { "balance": "1000000000000000000000" }
    },
    "difficulty": "1",
    "gasLimit": "8000000",
    "extraData": "0x000000000000000000000000000000000000000000000000000000000000000003535996AdA33C4Ccbc089C68b3A563Cd780aF25A4bcDa746d5Fde1f4bC86415a2daA49a6EEe903F00000000000000000000000000000000000000000000000000"
}
```

- Note: Check keystore for addresses

- For **Clique (PoA)**, a majority is required to seal a block. You can control the consensus by configuring the **number of validators**.
- For **IBFT**, you can set the **consensus threshold** in the `genesis.json` using the **`faulttolerance` parameter** under the `ibft2` configuration:

- **faulttolerance**: The percentage of validators required to agree to seal a block. For example, `0.667` means that 2/3 of the validators must agree.

### Step 1.5: Initialize the Blockchain with the Updated `genesis.json`

1. Save the modified `genesis.json` file in `C:\besu-network`.
2. Initialize the blockchain:

   ```cmd
   besu --data-path="C:\besu-network\node1\data" --genesis-file="C:\besu-network\genesis.json" --network-id=1337
   besu --data-path="C:\besu-network\node2\data" --genesis-file="C:\besu-network\genesis.json" --network-id=1337
   besu --data-path="C:\besu-network\node3\data" --genesis-file="C:\besu-network\genesis.json" --network-id=1337
   besu --data-path="C:\besu-network\node4\data" --genesis-file="C:\besu-network\genesis.json" --network-id=1337

   ```

## Step 3: Create Node Configuration Files

Create a `node-config.toml` file for each node to set environment variables and configurations. Below is an example configuration for **node 1** (`node1/node-config.toml`):

```toml
# Node Configuration
data-path = "C:/besu-network/node1"  # Directory for blockchain data for node 1
genesis-file = "C:/besu-network/genesis.json"  # Path to genesis block file

# Network Configuration
network-id = 1337  # Unique identifier for the network

# P2P Configuration
p2p-host = "127.0.0.1"
p2p-port = 30303  # P2P port for Node 1, default port 30303

# JSON-RPC HTTP Configuration
rpc-http-enabled = true # Enable RPC over HTTP for interacting with the node
rpc-http-api = ["ETH", "NET", "WEB3", "ADMIN", "MINER", "CLIQUE"]  # Specify enabled APIs
rpc-http-host = "127.0.0.1"
rpc-http-port = 8545  # RPC port for Node 1

# WebSocket Configuration
rpc-ws-enabled = true
rpc-ws-host = "127.0.0.1"  # Host for WebSocket service
rpc-ws-port = 8546  # WebSocket port for Node 1

# Allow any host to access RPC (use cautiously in production)
host-allowlist = ["*"]

# Bootnodes
# Bootnodes
bootnodes = [
  "enode://<node1_public_key>@<node1_ip>:30303",
  "enode://<node2_public_key>@<node2_ip>:30304",
  "enode://<node3_public_key>@<node3_ip>:30305",
  "enode://<node4_public_key>@<node4_ip>:30306"
]

# Enable P2P TLS
# p2p-tls-enabled = true  # Uncomment if TLS is required

# Node Identity
identity = "Node2"  # Identification for this node in the Client ID

# Key-Value Storage
key-value-storage =  "rocksdb"  # Options: "rocksdb" or "leveldb"

# Optional: Enable logging
logging = "INFO"
```

Repeat this for **node 2**, **node 3**, and **node 4**, updating the `data-path`, `p2p-port`, `rpc-http-port`, and bootnode addresses accordingly.

- **node 2**: Use `p2p-port=30310` and `rpc-http-port=8555`, `rpc-ws-port = 8556`.
- **node 3**: Use `p2p-port=30320` and `rpc-http-port=8565`, `rpc-ws-port = 8566`.
- **node 4**: Use `p2p-port=30330` and `rpc-http-port=8575`, `rpc-ws-port = 8576`

## Step 4: Generate Node Keys

Test configurarion
   besu --config-file="C:\besu-network\node1\node1-config.toml" --genesis-file="C:\besu-network\genesis.json" --network-id=1337
   besu --config-file="C:\besu-network\node2\node2-config.toml" --genesis-file="C:\besu-network\genesis.json" --network-id=1337
   besu --config-file="C:\besu-network\node3\node3-config.toml" --genesis-file="C:\besu-network\genesis.json" --network-id=1337
   besu --config-file="C:\besu-network\node4\node4-config.toml" --genesis-file="C:\besu-network\genesis.json" --network-id=1337


For each node, generate keys using Besu:

```sh
besu public-key export-address --data-path=./node1
besu public-key export-address --data-path=./node2
besu public-key export-address --data-path=./node3
besu public-key export-address --data-path=./node4
```

This will generate `key` and `address` files in each node's directory.

- Extract the public addresses of nodes 1, 2, and 3 and add them to the **extraData** field of the `genesis.json` file (as `<validator_address_1>`, etc.).
- Add the public address of **node 4** to the **alloc** section for an initial balance.

## Step 5: Create Static Nodes File

Create a file named `static-nodes.json` and place it in each node's directory (`node1/`, `node2/`, etc.):

```json
[
  "enode://<node1_public_key>@<node1_ip>:30303",
  "enode://<node2_public_key>@<node2_ip>:30303",
  "enode://<node3_public_key>@<node3_ip>:30303",
  "enode://<node4_public_key>@<node4_ip>:30303"
]
```

- Replace `<nodeX_public_key>` with the public key of each node (obtained from `besu public-key export-address`).
- Replace `<nodeX_ip>` with the IP address of each node.

## Step 6: Initialize the Nodes

For **node 1**, initialize the blockchain with the `genesis.json` file:

```sh
besu --data-path=./node1 init ./genesis.json
```

For **nodes 2, 3, and 4**, copy the `genesis.json` file from node 1 and initialize each node:

```sh
besu --data-path=./node2 init ./genesis.json
besu --data-path=./node3 init ./genesis.json
besu --data-path=./node4 init ./genesis.json
```

This command initializes the node's data directory with the genesis configuration.

## Step 7: Start the Nodes with their account

Now, start each node using the configuration file. Below is an example for **node 1**:

```sh
besu --config-file=./node1/node-config.toml
```

Repeat this process for **node 2**, **node 3**, and **node 4**.

## Step 8: Verify Network and Accounts

- **Check Connections**: Verify that nodes are connected by checking logs for peer connection messages.
- **Verify Initial Block**: Run the following to verify that block 0 has been created:

  ```sh
  besu --data-path=./node1 peers
  ```

- **Verify Accounts**:

  Create `checkAccount.js` to automate balance verification:

```javascript
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
  ```

- Run the script using Node.js:

```cmd
   node checkAccount.js
  // may need insatll
   npm install web3
   npm install keythereum
```

## Step 9: Deploy Smart Contracts

### Option 1: Using JavaScript (web3.js)

#### Step-by-Step Guide for Contract Deployment

1. **Log in (Decrypt the Account)**: Use the same mechanism as we did for checking the balance.

2. **Prepare the Contract Deployment Script**:
   - Use the ABI and bytecode of your contract to deploy it.
   - Extend the script to use the private key to create a signed transaction that deploys the contract.

#### Deployment Script Example

Here is an example script that logs in using the keystore and then deploys a smart contract:

1. **Ensure you have the Contract ABI and Bytecode**:
   - Suppose the contract JSON (`MyToken.json`) is in the directory `C:/FinancialContracts/build/contracts`.

2. **Updated Script**:

Create 'deployContract.js':

```javascript
const Web3 = require('web3').default;
const fs = require('fs');
const path = require('path');
const keythereum = require('keythereum');
const readline = require('readline');

// Initialize Web3 instance and account configuration
const web3 = new Web3('http://localhost:8545');
const account = '0x03535996AdA33C4Ccbc089C68b3A563Cd780aF25';
const keystoreDir = 'C:/besu-network/data/keystore';
const contractDir = 'C:/FinancialContracts/build/contracts';

// Load keystore and contract files
const keystoreFile = fs.readdirSync(keystoreDir).find(file =>
  file.includes(account.slice(2).toLowerCase())
);
const keystorePath = path.join(keystoreDir, keystoreFile);
const contractPath = path.join(contractDir, 'MyToken.json');
const { abi, bytecode } = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

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
    const keyObject = JSON.parse(fs.readFileSync(keystorePath));
    const privateKey = keythereum.recover(password, keyObject).toString('hex');
    const privateKeyHex = `0x${privateKey}`;

    // Add account to Web3 wallet
    const accountObj = web3.eth.accounts.privateKeyToAccount(privateKeyHex);
    web3.eth.accounts.wallet.add(accountObj);

    // Define the contract deployment
    const contract = new web3.eth.Contract(abi);

    // Deploy contract
    contract.deploy({
      data: bytecode,
      arguments: []  // Replace with any constructor arguments for your contract
    })
    .send({
      from: account,
      gas: 3000000,
      gasPrice: '20000000000'
    })
    .then(newContractInstance => {
      console.log('Contract deployed successfully!');
      console.log('Contract Address:', newContractInstance.options.address);
    })
    .catch(error => {
      console.error('Error deploying contract:', error);
    });

  } catch (error) {
    console.error('Error recovering the private key:', error);
  } finally {
    rl.close();
  }
});
```

#### Key Steps Explained

- **Keystore and Password**:
  - The script reads the `keystore.json` file and takes the password as input to decrypt it, just as you did for checking balances.

- **ABI and Bytecode**:
  - The ABI and bytecode are read from the JSON file (`MyToken.json`) that you compiled from your Solidity contract.


# Hardhat Setup and Deployment Guide

This guide walks you through setting up Hardhat, writing, deploying, and interacting with smart contracts on a local or Besu private network.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Install Hardhat and Dependencies](#install-hardhat-and-dependencies)
- [Project Configuration](#project-configuration)
- [Writing Contracts](#writing-contracts)
- [Compiling Contracts](#compiling-contracts)
- [Deploying Contracts](#deploying-contracts)
- [Interacting with Contracts](#interacting-with-contracts)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (recommended version: LTS, v18+)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (optional, for version control)

---

## Project Setup

1. **Initialize your besu networks**
1.1 **Initialize Validators**
Edit genesis.json
// Add your validator addresses in alloc
"alloc": {
    "0x03535996ada33c4ccbc089c68b3a563cd780af25": { "balance": "1000000000000000000000000000" },
    "0x4cf44da5f8bc9a88c310770307f5794488465e51": { "balance": "1000000000000000000000000000" },
    "0xd74fdba92d76d4d5d27ea8e6d45983fadd5c7fe2": { "balance": "1000000000000000000000000000" }
  },

//Revise extradata
//0x0000000000000000000000000000000000000000000000000000000000000000
//+ list of addresses without 0x
// + 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
example
  "extraData": "0x000000000000000000000000000000000000000000000000000000000000000003535996ada33c4ccbc089c68b3a563cd780af254cf44da5f8bc9a88c310770307f5794488465e51d74fdba92d76d4d5d27ea8e6d45983fadd5c7fe20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"

2.**Extract public key for nodes**

-Create a javascript extractPubkey.js

```javascript
const keythereum = require('keythereum');
const ethUtil = require('ethereumjs-util');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');

// Revise to your keystore path and validator account address
const account = '0x03535996AdA33C4Ccbc089C68b3A563Cd780aF25';
const keystoreDir = 'C:\\besu-network\\node1\\data\\keystore';

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
```

- Run javascript and key your password t extract the public keys

```cmd
node extractPubkey.js
```

3.**Node permissioning configuration**
-Create a file permissions_config.toml and add the publickey@IP:port to the file

```toml
# Node permissioning configuration

# Allowlist of nodes that are permitted to connect to the network
nodes-allowlist=[
  "enode://6b6e8f30a2009bef9c27783202596b6029b8fc35b3099a5e2198b4dd392a10381c2bf5722370ab46f5e758823086a596150a9fa0b7c4cd6312f44dcc869d097b@127.0.0.1:30303",
  "enode://6384bce222aaf800ea6dcf08907b21fc910af0f85df55f5984921e447c969ef2a221ee6ef9e8e25b2279ebb043e2b7bfbcdbf8f620cc2c594905e0abf9f71a10@127.0.0.1:30313",
  "enode://301bc6dbfc0a315b732e6741bbb2d096d8fd288dc05f043b7292e847366737a4edf5aae9e3bb803b7f924edd73840de044336467c2d954c220c492a6feb1f248@127.0.0.1:30323",
  "enode://38cde00f0daf33fd9d4358286cdb3446e504b8f42fbb6973d469474e9214f3188de20703b640d08a2d4bfbd0bbcb7ad7778ebe009348ecffc970457d8528d672@127.0.0.1:30333"
]
```

4.**Accoun permissioning configuration**

- create a file permissions_accounts_config.toml and add all your accounts

```toml
accounts-allowlist=["0x03535996ada33c4ccbc089c68b3a563cd780af25","0xa4bcda746d5fde1f4bc86415a2daa49a6eee903f","0x0ef02c1861842d96b9813c0da8f700c74f9dab46","0x123456789abcdef123456789abcdef123456789a"]
```

5.**Createe a javascript file to start nodes**

- Create a start.js

```javascript
const { exec } = require('child_process');
const keythereum = require('keythereum');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Writable } = require('stream');

// Revise to your keystore path and validator account address
const account = '0x03535996AdA33C4Ccbc089C68b3A563Cd780aF25';
const keystoreDir = 'C:\\besu-network\\node1\\data\\keystore';

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
    const besuCommand = `besu --config-file=./node1/node1-config.toml --node-private-key-file="${tempPrivateKeyFilePath}" --network-id=1337 --genesis-file=C:/besu-network/genesis.json`;
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

```

-Run javascript file to initiliaze your besu node

```cmd
node /path/to/start.js
```

6.**Createe a New Directory to deploy smart contracts**:

   ```bash
   mkdir deployments
   cd deployments
   ```

-Copy all your smart contracts to the path deployments/contracts

7.**Initialize a New Node.js Project**:

```bash
   npm init -y
   npm install @openzeppelin/contracts
   npm install keythereum
```

8.**Install Hardhat and Dependencies**

Install Hardhat and other required packages.

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox ethers dotenv
```

9.**Initialize Hardhat**

Run Hardhat initialization to set up the project structure.

```bash
npx hardhat
```

Note: enter to initilize seting (java code project)

10.**Confige hardhat**

- Createe `hardhat.config.js` for Configuration  for Hardhat.

```javascript
require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20"    // Update this to match the OpenZeppelin contracts
      },
      {
        version: "0.8.27"    // Optionally add other versions for compatibility with other contracts
      }
    ]
  },
  networks: {
    besu: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      gas: 4000000,
      gasPrice: 0
    }
  }
};

```

11.**Create javascritp file to deploy and check smart cotract**

- Createe `deploy.js` 

```javascript
const { ethers } = require("hardhat");

async function deployContract(contractName) {
  console.log(`Deploying ${contractName}...`);
  const ContractFactory = await ethers.getContractFactory(contractName);
  
  // Deploy the contract and get the address directly
  const contract = await ContractFactory.deploy();

  // Log the address directly without waiting
  console.log(`${contractName} deployed to:`, contract.target || contract.address);
  return contract;
}

async function main() {
  try {
    // Revise to your smart cotract list
    await deployContract("AssetToken");
    await deployContract("CBDC");
    await deployContract("MyToken");
    await deployContract("Remittance");
    await deployContract("StableCoin");
    await deployContract("Staking");
    await deployContract("SimpleContract");
    await deployContract("SimpleStorage");
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
```

- - Createe `interact.js` 

```javascript
const { ethers } = require("hardhat");

async function main() {
  // Load the AssetToken contract
  const assetTokenAddress = "0x2868Dd80bd79652EbD4a0a59A35587c153cab26A";
  const AssetToken = await ethers.getContractAt("AssetToken", assetTokenAddress);
  
  // Interact with the contract
  const name = await AssetToken.name();  // Assuming there's a `name` function
  console.log("AssetToken Name:", name);

  // You can add more interactions here
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```

- Copy all scripts to scripts folder `deployments/scripts`folder.


12.**Writing scritp ta decrypt your sceate key**

- Create `loadPrivateKey.js` and copy to `deployments` folder

```javascript
const fs = require("fs");
const path = require("path");
const keythereum = require("keythereum");
const readline = require("readline");

//Revise this to your key file (of the account to deploy smart contract)
const keystoreFilePath = "C:\\besu-network\\node1\\data\\keystore\\UTC--2024-10-29T03-13-52.121313600Z--03535996ada33c4ccbc089c68b3a563cd780af25";
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

```

- Run the javascript file to extract the screat key

```cmd
node loadPrivateKey.js
```

13.**Compiling Contracts**

Compile the contracts to check for errors and generate necessary artifacts.

```bash
npx hardhat compile
```

This command will compile all contracts in the `contracts/` folder.

---

14.**Deploying Contracts**
- Run the Deployment Script

Deploy the contracts to your network (e.g., Besu):

```bash
npx hardhat run scripts/deploy.js --network besu
```

---

- Interacting with Contracts
Run the interaction script:
After deploying, you can interact with your contracts using the Hardhat console or by writing a script.

- Run the interaction script:

```bash
npx hardhat run scripts/interact.js --network besu
```

## Environment Variables

Use a `.env` file in the project root to store sensitive information, like private keys.


## Troubleshooting

1. **Error: `@openzeppelin/contracts` Not Found**:
   - Install OpenZeppelin Contracts: `npm install @openzeppelin/contracts`.

2. **Error: `The contract code couldn't be stored`**:
   - Check and adjust the `gas` and `gasPrice` settings in `hardhat.config.js`.

3. **Error: `RPC_URL` or `PRIVATE_KEY` is undefined**:
   - Make sure `.env` is correctly set up and that `dotenv` is required in `hardhat.config.js`.

4. **Check Deployment on Besu**:
   - Use `--verbose-rpc` for detailed RPC logs: `npx hardhat run scripts/deploy.js --network besu --verbose`.

---

## Summary

1. **Initialize Project**: `npx hardhat`.
2. **Write Contracts**: Place contracts in the `contracts/` folder.
3. **Configure Network**: Update `hardhat.config.js` with your network settings.
4. **Compile Contracts**: `npx hardhat compile`.
5. **Deploy Contracts**: Write a deployment script and deploy with `npx hardhat run`.
6. **Interact with Contracts**: Use the console or scripts to interact with deployed contracts.

---

This guide should cover all the necessary steps to get started with Hardhat for writing, deploying, and interacting with smart contracts. Let me know if you need further assistance or additional details on specific steps!


## Summary

- Set up a Besu private network with 4 nodes.
- Configure nodes, generate accounts, and set initial validators.
- Verify that nodes are connected, accounts are configured correctly, and the initial block is present.
- Deploy smart contracts using either **web3.js** or **Truffle** with unlocked validator accounts.

This setup is useful for development, experimentation, or classroom demonstrations with Proof of Authority or IBFT consensus.
