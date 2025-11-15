const hre = require("hardhat");

async function main() {
  console.log("Deploying MultisigWallet...");
  console.log("Network:", hre.network.name);
  console.log("Note: Hardhat local node uses Chain ID 31337\n");

  // Lấy signers (accounts)
  const [deployer, ...signers] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Cấu hình owners và số chữ ký yêu cầu
  // Mặc định: 10 owners, cần 4 chữ ký
  const owners = [
    signers[0]?.address || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    signers[1]?.address || "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    signers[2]?.address || "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    signers[3]?.address || "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    signers[4]?.address || "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    signers[5]?.address || "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    signers[6]?.address || "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    signers[7]?.address || "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8",
    signers[8]?.address || "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    signers[9]?.address || "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
  ].slice(0, 10); // Lấy 10 owners đầu tiên

  const numConfirmationsRequired = 4;

  console.log("\nConfiguration:");
  console.log("Owners:", owners);
  console.log("Required confirmations:", numConfirmationsRequired);

  // Deploy contract
  const MultisigWallet = await hre.ethers.getContractFactory("MultisigWallet");
  const multisigWallet = await MultisigWallet.deploy(owners, numConfirmationsRequired);

  await multisigWallet.waitForDeployment();

  const address = await multisigWallet.getAddress();
  console.log("\n✅ MultisigWallet deployed to:", address);
  console.log("Network:", hre.network.name);
  console.log("\nContract Address:", address);
  console.log("Owners:", owners);
  console.log("Required Signatures:", numConfirmationsRequired);

  // Verify deployment
  console.log("\nVerifying deployment...");
  const contractOwners = await multisigWallet.getOwners();
  const required = await multisigWallet.numConfirmationsRequired();
  const balance = await multisigWallet.getBalance();

  console.log("Contract owners count:", contractOwners.length);
  console.log("Required confirmations:", required.toString());
  console.log("Contract balance:", hre.ethers.formatEther(balance), "ETH");

  // Lưu thông tin deploy
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    owners: owners,
    numConfirmationsRequired: numConfirmationsRequired,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log("\n📝 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

