const hre = require("hardhat");

async function main() {
  console.log("Checking account balances on Hardhat local network...\n");

  const accounts = await hre.ethers.getSigners();
  
  console.log("Account balances:");
  console.log("=".repeat(80));
  
  for (let i = 0; i < Math.min(10, accounts.length); i++) {
    const account = accounts[i];
    const balance = await hre.ethers.provider.getBalance(account.address);
    const balanceInEth = hre.ethers.formatEther(balance);
    
    console.log(`Account #${i}: ${account.address}`);
    console.log(`  Balance: ${balanceInEth} ETH`);
    console.log(`  Private Key: ${process.env[`PRIVATE_KEY_${i}`] || 'N/A'}`);
    console.log("");
  }
  
  // Check contract balance
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  try {
    const contractBalance = await hre.ethers.provider.getBalance(contractAddress);
    const contractBalanceInEth = hre.ethers.formatEther(contractBalance);
    console.log(`Contract (${contractAddress}):`);
    console.log(`  Balance: ${contractBalanceInEth} ETH`);
  } catch (error) {
    console.log("Contract not found or not deployed");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

