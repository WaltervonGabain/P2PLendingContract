const BorrowAndLendContract = artifacts.require("BorrowAndLendcontract");

contract("BorrowAndLendcontract", (accounts) => {
    let borrowAndLendContract;
    let fee = 5;
    let amount = 100

    beforeEach(async () => {
        borrowAndLendContract = await BorrowAndLendContract.new();
    });

    //-> Lenders pay money and receive money as a bonus. I’ll leave it up to you, how much, but be careful that it is not more than there is in the contract.
    // 1) Lend money function call
    it("should have offers to lend money", async () => {
        // GIVEN
        await borrowAndLendContract.lend(accounts[0], amount, fee);

        // WHEN
        const offerList = await borrowAndLendContract.getOffers();

        // THEN
        assert.equal(offerList.length, 1);
        assert.equal(offerList[0], accounts[0]);
    });

    it("should NOT have offers to lend money", async () => {
        // GIVEN
        const offerList = await borrowAndLendContract.getOffers();

        // THEN
        assert.equal(offerList.length, 0);
    });

    it("should have a 5% fee", async () => {
        // GIVEN
        await borrowAndLendContract.lend(accounts[0], amount, fee);

        // WHEN
        const offerList = await borrowAndLendContract.getOffers();

        // THEN
        assert.equal(offerList.length, 1);
        // TODO fetch fee
        // assert.equal(offerList[0].fee, fee);
    });

    //-> Borrowers receive money but need to pay fees when returning the money.
    // 1) Borrow money function to call
    // 2) pay back money + fee
    it("Borrow money", async () => {
        // GIVEN
        await borrowAndLendContract.lend(accounts[0], amount, fee);
        await borrowAndLendContract.borrow(accounts[0], accounts[1]);

        // WHEN
        const offerList = await borrowAndLendContract.offers;

        // THEN
        // TODO fetch address to
        // assert.equal(offerList[0].to, accounts[1]);
    })

    // it("should return a specific address", async () => {
    //     await borrowAndLendContract.lend(accounts[0], amount, fee);
    //     await borrowAndLendContract.lend(accounts[1], amount, fee);
    //     await borrowAndLendContract.lend(accounts[2], amount, fee);
    //     await borrowAndLendContract.lend(accounts[3], amount, fee);
    //
    //     const offerList = await borrowAndLendContract.getOffers();
    //     const lenderWallet = await borrowAndLendContract.getSpecificOffer(accounts[2]);
    //
    //     assert.equal(offerList.length, 4);
    //     assert.equal(lenderWallet, accounts[2]);
    // });
    //
    // it("should return null", async () => {
    //     await borrowAndLendContract.lend(accounts[0], amount, fee);
    //     await borrowAndLendContract.lend(accounts[1], amount, fee);
    //     await borrowAndLendContract.lend(accounts[2], amount, fee);
    //     await borrowAndLendContract.lend(accounts[3], amount, fee);
    //
    //     const offerList = await borrowAndLendContract.getOffers();
    //     const offerId = await borrowAndLendContract.getOfferId("12312412312312adasvweda");
    //
    //     assert.equal(offerList.length, 4);
    //     assert.equal(lenderWallet, null);
    // });

})




