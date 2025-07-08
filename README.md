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

- **Contract Deployment**:
  - After logging in, the contract is deployed using:

  ```javascript
  contract.deploy({
    data: bytecode,
    arguments: []  // Any constructor arguments for your contract
  })
  ```

  - The `send()` method sends a transaction to deploy the contract from the account.

- **Gas and Gas Price**:
  - Adjust the `gas` and `gasPrice` values as per your contract requirements. The `gas` parameter should be large enough to cover the contract deployment.

#### Running the Script

1. **Run the script**:

   ```sh
   node checkAccount.js
   ```

2. **Enter the password** when prompted.
3. **Check the output** to get the contract address after successful deployment.

#### Security Note

- **Handle Passwords Securely**: Ensure that passwords are kept secure and avoid hard-coding sensitive information.
- **Private Key**: Storing and using private keys directly should be done with caution, especially in production environments.

### Option 2: Using Truffle

1. **Login with Validator Account**:
   - Unlock the validator account using the configuration file (`node-config.toml`).
2. **Install Truffle**:

   ```sh
   npm install -g truffle
   ```

3. **Deploy Contract**:
   - Configure `truffle-config.js` for the Besu network and deploy using `truffle migrate`.

## Summary

- Set up a Besu private network with 4 nodes.
- Configure nodes, generate accounts, and set initial validators.
- Verify that nodes are connected, accounts are configured correctly, and the initial block is present.
- Deploy smart contracts using either **web3.js** or **Truffle** with unlocked validator accounts.

This setup is useful for development, experimentation, or classroom demonstrations with Proof of Authority or IBFT consensus.
