require("truffle-test-utils").init();

const STBXToken = artifacts.require("STBXToken");
const utils = require("./helpers/utils");

contract("STBXToken", (accounts) => {
  const [superadmin, bob, alice] = accounts;

  beforeEach(async () => {
    contractInstance = await STBXToken.new();
  });

  it("should be not whitelisted address", async () => {
    assert.equal(
      false,
      await contractInstance.isWhitelistedAddress(bob, { from: superadmin })
    );
  });

  it("owner should be whitelisted address", async () => {
    assert.equal(
      true,
      await contractInstance.isWhitelistedAddress(superadmin, {
        from: superadmin,
      })
    );
  });

  it("add and remove from whitelist", async () => {
    await utils.shouldThrow(
      contractInstance.addAddressToWhitelist(alice, { from: bob })
    );
    await contractInstance.addWhitelister(bob, { from: superadmin });
    assert.equal(
      true,
      await contractInstance.isWhitelister(bob, { from: bob })
    );
    assert.equal(
      false,
      await contractInstance.isWhitelister(alice, { from: alice })
    );
    await contractInstance.addAddressToWhitelist(alice, { from: bob });
    assert.equal(
      true,
      await contractInstance.isWhitelistedAddress(alice, { from: superadmin })
    );
    await contractInstance.removeAddressFromWhitelist(alice, { from: bob });
    assert.equal(
      false,
      await contractInstance.isWhitelistedAddress(alice, { from: superadmin })
    );
  });

  it("freezing of funds", async () => {
    await contractInstance.addWhitelister(superadmin, { from: superadmin });
    await contractInstance.addAddressToWhitelist(bob, { from: superadmin });
    await contractInstance.addAddressToWhitelist(alice, { from: superadmin });
    await contractInstance.transfer(bob, 1000, { from: superadmin });
    await contractInstance.transfer(alice, 100, { from: bob });
    await contractInstance.addFreezer(alice, { from: superadmin });
    await contractInstance.freezeFunds(bob, { from: alice });
    await utils.shouldThrow(
      contractInstance.transfer(alice, 900, { from: bob })
    );
    await contractInstance.unfreezeFunds(bob, { from: alice });
    await contractInstance.transfer(alice, 900, { from: bob });
  });

  it("transfering of funds", async () => {
    let balance;

    await contractInstance.addWhitelister(superadmin, { from: superadmin });
    await contractInstance.addLimiter(superadmin, { from: superadmin });
    await contractInstance.addAddressToWhitelist(bob, { from: superadmin });
    await contractInstance.addAddressToWhitelist(alice, { from: superadmin });

    await contractInstance.setTransferLimit(superadmin, 100000, {
      from: superadmin,
    });
    await contractInstance.transfer(bob, 10000, { from: superadmin });

    await contractInstance.addTransporter(superadmin, { from: superadmin });
    await contractInstance.addTransporter(alice, { from: superadmin });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(10000, balance);

    await contractInstance.transferFunds(bob, superadmin, 10000, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(superadmin, {
      from: superadmin,
    });
    assert.equal(10000000, balance);

    await contractInstance.transferFunds(superadmin, bob, 10000000, {
      from: alice,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(10000000, balance);

    await contractInstance.splitOrMerge(1 * 10 ** 5, 2 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(20000000, balance);
    balance = await contractInstance.balanceOf(alice, { from: alice });
    assert.equal(0, balance);

    await contractInstance.transferFunds(bob, alice, 50000, { from: alice });

    balance = await contractInstance.balanceOf(alice, { from: alice });
    assert.equal(50000, balance);
    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(19950000, balance);

    await contractInstance.splitOrMerge(2 * 10 ** 5, 3 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(29925000, balance);

    await contractInstance.transferFunds(bob, alice, 15000, { from: alice });

    balance = await contractInstance.balanceOf(alice, { from: alice });
    assert.equal(90000, balance);
    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(29910000, balance);
  });

  it("minting and burning of funds", async () => {
    let balance;

    await contractInstance.addWhitelister(superadmin, { from: superadmin });
    await contractInstance.addLimiter(superadmin, { from: superadmin });
    await contractInstance.addAddressToWhitelist(bob, { from: superadmin });

    await contractInstance.setTransferLimit(superadmin, 100000, {
      from: superadmin,
    });
    await contractInstance.transfer(bob, 10000, { from: superadmin });
    await contractInstance.mint(bob, 1000, { from: superadmin });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(11000, balance);

    await contractInstance.splitOrMerge(1 * 10 ** 5, 2 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(22000, balance);

    await contractInstance.mint(bob, 1000, { from: superadmin });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(23000, balance);

    await contractInstance.mint(bob, 5000, { from: superadmin });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(28000, balance);

    await contractInstance.burn(bob, 500, { from: superadmin });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(27500, balance);

    await utils.shouldThrow(contractInstance.burn(bob, 500, { form: alice }));
    await utils.shouldThrow(contractInstance.mint(bob, 1000, { from: alice }));
    await utils.shouldThrow(
      contractInstance.burn(bob, 27600, { from: superadmin })
    );
  });

  it("stock splits and reverse splits", async () => {
    let balance;
    let totalSupply;

    await contractInstance.addWhitelister(superadmin, { from: superadmin });
    await contractInstance.addLimiter(superadmin, { from: superadmin });
    await contractInstance.addAddressToWhitelist(bob, { from: superadmin });

    await contractInstance.setTransferLimit(superadmin, 100000, {
      from: superadmin,
    });
    await contractInstance.transfer(bob, 10000, { from: superadmin });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(10000, balance);

    totalSupply = await contractInstance.totalSupply({ from: superadmin });
    assert.equal(10000000, totalSupply);

    await contractInstance.splitOrMerge(1 * 10 ** 5, 2 * 10 ** 5, {
      from: superadmin,
    });

    totalSupply = await contractInstance.totalSupply({ from: superadmin });
    assert.equal(20000000, totalSupply);

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(20000, balance);

    await contractInstance.splitOrMerge(2 * 10 ** 5, 3 * 10 ** 5, {
      from: superadmin,
    });

    totalSupply = await contractInstance.totalSupply({ from: superadmin });
    assert.equal(30000000, totalSupply);

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(30000, balance);

    await contractInstance.splitOrMerge(1 * 10 ** 5, 4 * 10 ** 5, {
      from: superadmin,
    });

    totalSupply = await contractInstance.totalSupply({ from: superadmin });
    assert.equal(120000000, totalSupply);

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(120000, balance);

    await contractInstance.splitOrMerge(3 * 10 ** 5, 7 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(279999, balance);

    await contractInstance.splitOrMerge(4 * 10 ** 5, 1 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(69999, balance);

    await contractInstance.splitOrMerge(4 * 10 ** 5, 1 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(17499, balance);

    await contractInstance.splitOrMerge(7 * 10 ** 5, 4 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(9999, balance);

    await contractInstance.splitOrMerge(4 * 10 ** 5, 1 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(2499, balance);

    await contractInstance.splitOrMerge(8 * 10 ** 5, 1 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(312, balance);

    await contractInstance.splitOrMerge(5 * 10 ** 5, 3 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(187, balance);
  });

  it("deciaml ratio splits and reverse splits", async () => {
    let balance;
    let totalSupply;

    await contractInstance.addWhitelister(superadmin, { from: superadmin });
    await contractInstance.addLimiter(superadmin, { from: superadmin });
    await contractInstance.addAddressToWhitelist(bob, { from: superadmin });
    await contractInstance.setTransferLimit(superadmin, 100000, {
      from: superadmin,
    });
    await contractInstance.transfer(bob, 5000, { from: superadmin });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(5000, balance);

    totalSupply = await contractInstance.totalSupply({ from: superadmin });
    assert.equal(10000000, totalSupply);

    await contractInstance.splitOrMerge(1 * 10 ** 5, 133300, {
      from: superadmin,
    });

    totalSupply = await contractInstance.totalSupply({ from: superadmin });
    assert.equal(13330000, totalSupply);

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(6665, balance);
  });

  it("voter role", async () => {
    assert.equal(
      false,
      await contractInstance.isVoter(superadmin, { from: superadmin })
    );
    assert.equal(false, await contractInstance.isVoter(bob, { from: bob }));

    await contractInstance.addVoter(bob, { from: superadmin });

    assert.equal(true, await contractInstance.isVoter(bob, { from: bob }));

    await contractInstance.removeVoter(bob, { from: superadmin });

    assert.equal(false, await contractInstance.isVoter(bob, { from: bob }));
  });

  it("limits", async () => {
    let limit;
    let allowedToTransfer;

    await contractInstance.addWhitelister(superadmin, { from: superadmin });
    await contractInstance.addLimiter(superadmin, { from: superadmin });
    await contractInstance.addAddressToWhitelist(bob, { from: superadmin });
    await utils.shouldThrow(
      contractInstance.transfer(bob, 100001, { from: superadmin })
    );

    limit = await contractInstance.getTransferLimit(superadmin, {
      from: superadmin,
    });
    assert.equal(limit, 1000);

    allowedToTransfer = await contractInstance.getAllowedToTransfer(
      superadmin,
      { from: superadmin }
    );
    assert.equal(allowedToTransfer, 0);

    await contractInstance.transfer(bob, 500, { from: superadmin });

    allowedToTransfer = await contractInstance.getAllowedToTransfer(
      superadmin,
      { from: superadmin }
    );
    assert.equal(allowedToTransfer, 500);

    limit = await contractInstance.getTransferLimit(bob, { from: bob });
    assert.equal(limit, 1000);

    await utils.shouldThrow(
      contractInstance.setTransferLimit(bob, 500, { from: bob })
    );
    await contractInstance.setTransferLimit(bob, 500, { from: superadmin });

    limit = await contractInstance.getTransferLimit(bob, { from: bob });
    assert.equal(limit, 500);

    await contractInstance.transfer(superadmin, 499, { from: bob });

    allowedToTransfer = await contractInstance.getAllowedToTransfer(bob, {
      from: bob,
    });
    assert.equal(allowedToTransfer, 1);

    await utils.shouldThrow(
      contractInstance.transfer(superadmin, 10, { from: bob })
    );
  });

  it("reverse stock split", async () => {
    let balance;
    let totalSupply;

    await contractInstance.addWhitelister(superadmin, { from: superadmin });
    await contractInstance.addLimiter(superadmin, { from: superadmin });
    await contractInstance.addAddressToWhitelist(bob, { from: superadmin });

    await contractInstance.setTransferLimit(superadmin, 100000, {
      from: superadmin,
    });
    await contractInstance.transfer(bob, 10000, { from: superadmin });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(10000, balance);

    totalSupply = await contractInstance.totalSupply({ from: superadmin });
    assert.equal(10000000, totalSupply);

    await contractInstance.splitOrMerge(2 * 10 ** 5, 1 * 10 ** 5, {
      from: superadmin,
    });

    totalSupply = await contractInstance.totalSupply({ from: superadmin });
    assert.equal(5000000, totalSupply);

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(5000, balance);

    balance = await contractInstance.balanceOf(superadmin, {
      from: superadmin,
    });
    assert.equal(4995000, balance);

    await contractInstance.transfer(bob, 10000, { from: superadmin });

    balance = await contractInstance.balanceOf(superadmin, {
      from: superadmin,
    });
    assert.equal(4985000, balance);

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(15000, balance);

    await contractInstance.transfer(bob, 20000, { from: superadmin });

    balance = await contractInstance.balanceOf(superadmin, {
      from: superadmin,
    });
    assert.equal(4965000, balance);

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(35000, balance);

    await contractInstance.splitOrMerge(2 * 10 ** 5, 1 * 10 ** 5, {
      from: superadmin,
    });

    balance = await contractInstance.balanceOf(superadmin, {
      from: superadmin,
    });
    assert.equal(2482500, balance);

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(17500, balance);
  });

  it("check isDisabledWhitelist functionality", async () => {
    let balance;

    await contractInstance.addLimiter(superadmin, { from: superadmin });
    await contractInstance.setTransferLimit(superadmin, 100000, {
      from: superadmin,
    });
    await contractInstance.transfer(bob, 10000, { from: superadmin });

    balance = await contractInstance.balanceOf(bob, { from: bob });
    assert.equal(10000, balance);

    balance = await contractInstance.balanceOf(superadmin, {
      from: superadmin,
    });
    assert.equal(9990000, balance);

    await contractInstance.toggleOpenWhitelist(true, { from: superadmin });

    await utils.shouldThrow(
      contractInstance.transfer(bob, 10000, { from: superadmin })
    );
  });
});
