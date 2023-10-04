const Storage = artifacts.require("P2PLendingContract");

module.exports = function (deployer) {
  deployer.deploy(Storage);
};
