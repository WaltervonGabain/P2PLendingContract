const Storage = artifacts.require("BorrowAndLendContract");

module.exports = function (deployer) {
  deployer.deploy(Storage);
};
