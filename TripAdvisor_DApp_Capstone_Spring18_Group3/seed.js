Eutil = require('ethereumjs-util');
TripAdvisorAdd = artifacts.require("./TripAdvisorAdd.sol");
module.exports = function(callback) {
 TripAdvisorAdd.deployed().then(function(i) {i.addPlaceReview('Taj Mahal', 'Tourist', 'QmS4kZbwkHFwqJWQosgjwLWLWYHdmCqYia4mDZGh4xepsf', 'QmNUfrXLo8aWh6RfSUdkj5jPBf1AbH3QvgNc1NqjUB6iGq',5).then(function(f) {console.log(f)})});
 TripAdvisorAdd.deployed().then(function(i) {i.addPlaceReview('RockerFellar', 'Tourist', 'QmPRkiJPZPqW1eXjJscFtbmhQC5LAG2NUMmFApe4QN6cBQ', 'QmTA5mB25a5SmhKGEMuxS3gnqNcFJZBkgtJJJqoztbPXb2',5).then(function(f) {console.log(f)})});
 TripAdvisorAdd.deployed().then(function(i) {i.addPlaceReview('UHCL', 'Education', 'QmXsqKTQ6B8zVxV6x4G8WGWSBZotNi47HDpi2UAM2eq82U', 'QmVaXejg5JHpeCPLVr8eJtSQTnVJPfMth1R7YDPvNBuA9C',5).then(function(f) {console.log(f)})});
 TripAdvisorAdd.deployed().then(function(i) {i.addPlaceReview('Torchys Tacos', 'Restuarant', 'QmTsswt263oPppPDWkFG24KtzyyzPP6KcXLUgmTvC8NdrZ', 'QmPjyXuLpuV2aPTL8tFGJE52Sw3Zh5jksBnwjrKbgTE6TE',5).then(function(f) {console.log(f)})});
 TripAdvisorAdd.deployed().then(function(i) {i.getPlace.call().then(function(f){console.log(f)})});
}

