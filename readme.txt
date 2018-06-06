Title: Tripadvisor Dapp //Capstone_Spring18_Group3

Motivations:

1. In order to drift from centralized to decentralized applications, using Blockchain is the best solution available.
2. Centralized tripadvisor application doesn't reward the users , whilst Tripadvisor Dapp gives cryptotokens to the users.
3. The data written onto the blockchain is immutable whilst the data in a centralized Tripadvisor is contained by single authority.
 
Copyrights:

 ©cryptominers,University of Houston Clear- Lake

Installation instructions:

1. Install NodeJS

2. Install Truffle framework
   
    npm install -g truffle

3. Setup metamask
      Install the  google chrome extension of metamask 

4. Select the Testnetwork on the top of the metamask menu.(recommended TestRPC)

6. Open command prompt on the path to Tripadvisor Dapp folder to  initiate the truffle framework and type :
     >truffle init

7. Open command prompt to  start Blockchain and type:
     > ganache -cli

8. Open command prompt to start IPFS daemon and type:
     > ipfs daemon

9. Open command prompt to start NodeJS server and type:
    > npm run dev

10. Open command prompt to Compile and Migrate contracts and  type: 
   > truffle migrate --reset // Deploy smart contracts using Truffle Framework

           The Tripadvisor Dapp runs on the NodeJS server and the localhost address is generally:
   http://localhost:8081/ 