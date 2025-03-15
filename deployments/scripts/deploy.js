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

    await deployContract("DealComerce");
    // const unlockTime = 10000;
    // Deploy Lock contract with unlockTime as an argument
    // await deployContract("Lock", unlockTime);
    // Revise to your smart cotract list
    //await deployContract("SupplyChain");
    // await deployContract("AssetToken");
    // await deployContract("CBDC");
    // await deployContract("MyToken");
    // await deployContract("Remittance");
    // await deployContract("StableCoin");
    // await deployContract("Staking");
    // await deployContract("SimpleContract");
    // await deployContract("SimpleStorage");
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));