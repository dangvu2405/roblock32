const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultisigWallet", function () {
  let multisigWallet;
  let owners;
  let numConfirmationsRequired = 4;
  let deployer, owner1, owner2, owner3, owner4, owner5, nonOwner;

  beforeEach(async function () {
    [deployer, owner1, owner2, owner3, owner4, owner5, nonOwner] = await ethers.getSigners();

    // Tạo 10 owners
    owners = [
      owner1.address,
      owner2.address,
      owner3.address,
      owner4.address,
      owner5.address,
      deployer.address,
      (await ethers.getSigners())[6].address,
      (await ethers.getSigners())[7].address,
      (await ethers.getSigners())[8].address,
      (await ethers.getSigners())[9].address,
    ];

    const MultisigWallet = await ethers.getContractFactory("MultisigWallet");
    multisigWallet = await MultisigWallet.deploy(owners, numConfirmationsRequired);
    await multisigWallet.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owners", async function () {
      const contractOwners = await multisigWallet.getOwners();
      expect(contractOwners.length).to.equal(10);
      expect(contractOwners).to.include(owner1.address);
    });

    it("Should set the right number of required confirmations", async function () {
      expect(await multisigWallet.numConfirmationsRequired()).to.equal(numConfirmationsRequired);
    });
  });

  describe("Transactions", function () {
    it("Should submit a transaction", async function () {
      const to = owner2.address;
      const value = ethers.parseEther("1");
      const data = "0x";

      await expect(multisigWallet.connect(owner1).submitTransaction(to, value, data))
        .to.emit(multisigWallet, "SubmitTransaction")
        .withArgs(owner1.address, 0, to, value, data);

      const tx = await multisigWallet.getTransaction(0);
      expect(tx.to).to.equal(to);
      expect(tx.value).to.equal(value);
      expect(tx.executed).to.be.false;
    });

    it("Should confirm a transaction", async function () {
      const to = owner2.address;
      const value = ethers.parseEther("1");
      const data = "0x";

      await multisigWallet.connect(owner1).submitTransaction(to, value, data);
      await expect(multisigWallet.connect(owner1).confirmTransaction(0))
        .to.emit(multisigWallet, "ConfirmTransaction")
        .withArgs(owner1.address, 0);

      const isConfirmed = await multisigWallet.isTransactionConfirmed(0, owner1.address);
      expect(isConfirmed).to.be.true;
    });

    it("Should execute transaction when enough confirmations", async function () {
      const to = owner2.address;
      const value = ethers.parseEther("1");
      const data = "0x";

      // Gửi ETH vào ví trước
      await owner1.sendTransaction({
        to: await multisigWallet.getAddress(),
        value: ethers.parseEther("2"),
      });

      // Submit transaction
      await multisigWallet.connect(owner1).submitTransaction(to, value, data);

      // Confirm bởi 4 owners
      await multisigWallet.connect(owner1).confirmTransaction(0);
      await multisigWallet.connect(owner2).confirmTransaction(0);
      await multisigWallet.connect(owner3).confirmTransaction(0);
      await multisigWallet.connect(owner4).confirmTransaction(0);

      // Execute
      await expect(multisigWallet.connect(owner1).executeTransaction(0))
        .to.emit(multisigWallet, "ExecuteTransaction")
        .withArgs(owner1.address, 0);

      const tx = await multisigWallet.getTransaction(0);
      expect(tx.executed).to.be.true;
    });

    it("Should not execute transaction without enough confirmations", async function () {
      const to = owner2.address;
      const value = ethers.parseEther("1");
      const data = "0x";

      await owner1.sendTransaction({
        to: await multisigWallet.getAddress(),
        value: ethers.parseEther("2"),
      });

      await multisigWallet.connect(owner1).submitTransaction(to, value, data);
      await multisigWallet.connect(owner1).confirmTransaction(0);
      await multisigWallet.connect(owner2).confirmTransaction(0);

      // Chỉ có 2 confirmations, cần 4
      await expect(
        multisigWallet.connect(owner1).executeTransaction(0)
      ).to.be.revertedWith("cannot execute tx");
    });
  });

  describe("Access Control", function () {
    it("Should not allow non-owner to submit transaction", async function () {
      await expect(
        multisigWallet.connect(nonOwner).submitTransaction(owner2.address, 0, "0x")
      ).to.be.revertedWith("not owner");
    });
  });
});

