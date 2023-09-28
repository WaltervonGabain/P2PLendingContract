const MintingContract = artifacts.require("MintingContract");

contract("MintingContract", (accounts) => {
  let mintingContract;

  beforeEach(async () => {
    mintingContract = await MintingContract.new();
  });

  it("should mint an NFT and add a candidate", async () => {
    await mintingContract.mint(accounts[0]);
    const candidateList = await mintingContract.getCandidates();

    assert.equal(candidateList.length, 1);
    assert.equal(candidateList[0], accounts[0]);
  });

  it("should vote for a candidate", async () => {
    await mintingContract.mint(accounts[0]);
    await mintingContract.vote(accounts[0]);
    const votes = await mintingContract.getVotes();

    assert.equal(votes.length, 1);
    assert.equal(votes[0].voteCount, 1);
  });

  it("should not allow voting twice from the same address", async () => {
    await mintingContract.mint(accounts[0]);
    await mintingContract.vote(accounts[0]);

    try {
      await mintingContract.vote(accounts[0]);
      assert.fail("Voting should have thrown an error");
    } catch (error) {
      assert(
        error.message.includes("You have already voted"),
        "Unexpected error message"
      );
    }
  });

  it("should not allow voting for an invalid candidate", async () => {
    await mintingContract.mint(accounts[0]);

    try {
      await mintingContract.vote(accounts[1]);
      assert.fail("Voting should have thrown an error");
    } catch (error) {
      assert(
        error.message.includes("Invalid candidate"),
        "Unexpected error message"
      );
    }
  });
});
