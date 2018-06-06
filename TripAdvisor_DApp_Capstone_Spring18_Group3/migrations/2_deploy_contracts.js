var TripAdvisorAdd = artifacts.require("./TripAdvisorAdd.sol");

module.exports = function(deployer) {
 deployer.deploy(TripAdvisorAdd,10000, web3.toWei('0.01', 'ether'));
};