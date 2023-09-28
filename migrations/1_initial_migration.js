const Storage = artifacts.require("MintingContract");

module.exports = function (deployer) {
  deployer.deploy(Storage);
};
