const P2PLendingContract = artifacts.require("P2PLendingContract");

contract("P2PLendingContract", (accounts) => {
  let contract;
  let fee = 5;
  let amount = 1000000; // loan is 1 million wei
  let amountWei = web3.utils.toWei(amount.toString(), "wei"); // Amount of Ether to send (in Wei)

  beforeEach(async () => {
    contract = await P2PLendingContract.new();
  });

  it("should receive payment and update totalPayments", async () => {
    // GIVEN
    await contract.receivePayment({ // Send Ether to the contract's receivePayment function
      from: accounts[0],
      value: amountWei,
    });

    // WHEN
    const totalPayments = await contract.totalPayments(); // Get the updated totalPayments value from the contract

    // THEN
    assert.equal(totalPayments.toString(), amountWei, "Total payments should match sent wei amount"); // Assert that totalPayments has been updated with the sent Ether
  });

  it("should have loans", async () => {
    // GIVEN
    await contract.addLoan(accounts[0], amount, fee);

    // WHEN
    const loanList = await contract.getLoans();

    // THEN
    assert.equal(loanList.length, 1);
    assert.equal(loanList[0].lender, accounts[0]);
  });

  it("should NOT have loans", async () => {
    // GIVEN
    const loanList = await contract.getLoans();

    // THEN
    assert.equal(loanList.length, 0);
  });

  it("should have a 5% fee", async () => {
    // GIVEN
    await contract.addLoan(accounts[0], amount, fee);
    let feePercentage = fee;

    // WHEN
    const loanList = await contract.getLoans();

    // THEN
    assert.equal(loanList[0].fee, feePercentage);
  });

  it("should have a loan ID", async () => {
    // GIVEN
    await contract.addLoan(accounts[0], amount, fee);
    await contract.addLoan(accounts[1], amount, fee);

    // WHEN
    const loanList = await contract.getLoans();

    // THEN
    assert.equal(loanList[1].id, 1);
  });

  it("should take loan", async () => {
    // GIVEN
    await contract.addLoan(accounts[0], amount, fee);
    await contract.receivePayment({
      from: accounts[0],
      value: amountWei,
    });

    await contract.takeLoan(0, accounts[1]);

    // WHEN
    const loanList = await contract.getLoans();

    // THEN
    assert.notEqual(loanList[0].borrower, accounts[0]);
  });

  it("should throw took invalid loan", async () => {
    try {
      await contract.takeLoan(0, accounts[1]);
      assert.fail("Should throw took invalid loan");
    } catch (error) {
      assert(
        error.message.includes("Took invalid loan"),
        "Unexpected error message"
      );
    }
  });

  it("should throw cant loan to self", async () => {
    // GIVEN
    await contract.addLoan(accounts[0], amount, fee);

    // THEN
    try {
      await contract.takeLoan(0, accounts[0]);
      assert.fail("Should throw cant loan to self");
    } catch (error) {
      assert(
        "Unexpected error message"
      );
    }
  });

  it("should pay loan", async () => {
    // GIVEN
    await contract.addLoan(accounts[0], amount, fee);
    await contract.receivePayment({
      from: accounts[0],
      value: amountWei,
    });

    await contract.addLoan(accounts[0], amount, fee);
    await contract.receivePayment({
      from: accounts[0],
      value: amountWei,
    });

    await contract.addLoan(accounts[0], amount, fee);
    await contract.receivePayment({
      from: accounts[0],
      value: amountWei,
    });

    await contract.takeLoan(0, accounts[1]);
    let amountPaid = 500000; // pay half a million wei
    let expectedRemainder = 525000;

    // WHEN
    await contract.payLoan(0, amountPaid);
    const loanList = await contract.getLoans();

    // THEN
    assert.equal(loanList[0].amount, expectedRemainder);
  });

  it("should throw paid invalid loan", async () => {
    try {
      await contract.payLoan(0, 100);
      assert.fail("Should throw paid invalid loan");
    } catch (error) {
      assert(
          error.message.includes("Paid invalid loan"),
          "Unexpected error message"
      );
    }
  });

  it("should throw loan is already paid off", async () => {
    // GIVEN
    await contract.addLoan(accounts[0], amount, fee);
    await contract.receivePayment({
      from: accounts[0],
      value: amountWei,
    });
    let amountPaid = 1052500;

    // WHEN
    await contract.payLoan(0, amountPaid);

    try {
      await contract.payLoan(0, 100);
      assert.fail("Should throw loan is already paid off");
    } catch (error) {
      assert(
          error.message.includes("Loan is already paid off"),
          "Unexpected error message"
      );
    }
  });

});
