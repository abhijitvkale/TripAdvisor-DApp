// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 6600000,
      from: '0x8027e4773bf7b1e2587cdd2e9dd9da1e0d3a61b9'
      // Match any network id
    }
  }
}
