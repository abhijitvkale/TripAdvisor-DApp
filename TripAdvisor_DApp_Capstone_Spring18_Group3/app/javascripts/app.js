// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import TripAdvisorAdd_artifacts from '../../build/contracts/TripAdvisorAdd.json';

var TripAdvisorAdd = contract(TripAdvisorAdd_artifacts);
var reviewcountnum = null;
let tokenPrice = null;

const ipfsAPI = require('ipfs-api');
const ethUtil = require('ethereumjs-util');

const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});

window.App = {
 start: function() {
  var self = this;

  TripAdvisorAdd.setProvider(web3.currentProvider);
 
  reviewCount();
  renderList();
  populateTokenData();

  var reader;

  if($("#product-details").length > 0) {
    //This is product details page
    let productId = new URLSearchParams(window.location.search).get('id');
    renderProductDetails(productId);
   }
 

  $("#product-image").change(function(event) {
    const file = event.target.files[0]
    reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
  });


  $("#add-item-to-store").submit(function(event) {
    const req = $("#add-item-to-store").serialize();
    let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    let decodedParams = {}
    Object.keys(params).forEach(function(v) {
     decodedParams[v] = decodeURIComponent(decodeURI(params[v]));
    });
    saveProduct(reader, decodedParams);
    event.preventDefault();
  });

 }

};

window.addEventListener('load', function() {
 // Checking if Web3 has been injected by the browser (Mist/MetaMask)
 if (typeof web3 !== 'undefined') {
  console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
  // Use Mist/MetaMask's provider
  window.web3 = new Web3(web3.currentProvider);
 } else {
  console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 }
 App.start();
});

window.buyTokens = function() {
  let tokensToBuy = $("#buy").val();
  console.log("Test buyTokens() "+ tokensToBuy+"");
  let price = tokensToBuy * tokenPrice;
  console.log("Test buyTokens()");
  $("#buy-msg").html("Purchase order has been submitted. Please wait.");
  TripAdvisorAdd.deployed().then(function(contractInstance) {
    contractInstance.buy({value: web3.toWei(price, 'ether'), from: web3.eth.accounts[0]}).then(function(v) {
      $("#buy-msg").html("");
      web3.eth.getBalance(contractInstance.address, function(error, result) {
        $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
      });
    })
  });
  populateTokenData();
}

window.lookupPersonInfo = function() {
  let address = $("#voter-info").val();
  TripAdvisorAdd.deployed().then(function(contractInstance) {
    contractInstance.personDetails.call(address).then(function(v) {
      $("#tokens-bought").html("Total Tokens bought: " + v.toString());
    });
  });
}

function reviewCount() {
  TripAdvisorAdd.deployed().then(function(i) {
  i.totalReviews.call().then(function(p) {

    $("#total-products").html(p+"</br>");
    
  });
  });
}

  
  function populateTokenData() {
    TripAdvisorAdd.deployed().then(function(contractInstance) {
      contractInstance.totalTokens.call().then(function(v) {
        $("#tokens-total").html(v.toString());
      });
      contractInstance.tokensSold.call().then(function(v) {
        $("#tokens-sold").html(v.toString());
      });
      contractInstance.tokenPrice.call().then(function(v) {
        console.log("Test TokenPrice()");
        tokenPrice = parseFloat(web3.fromWei(v.toString()));
        $("#token-cost").html(tokenPrice + " Ether");
      });
     contractInstance.balanceTokens.call().then(function(v) {
      console.log("Test BalnceTokens()");
      $("#contract-balance").html(v.toString());
    });
     
    });
  }
 function renderList() {
 
  TripAdvisorAdd.deployed().then(function(i) {
    i.totalReviews.call().then(function(p) {
		for (var j = 1; j <=parseInt(p,10); j++) {
      let k = j;
      console.log("Test:" + parseInt(p,10));
			TripAdvisorAdd.deployed().then(function(i) {
			i.getPlace.call(k).then(function(p) {
			$("#product-list").append(buildList(p,k));
		});
	   });
	  }  
    });
  }); 
 }
 
 
 function buildList(product,k) {
  let node = $("<div/>");
  node.addClass("col-sm-3 text-center col-margin-bottom-1");
  node.append("<img src='https://ipfs.io/ipfs/" + product[3] + "' width='150px' />");
  node.append("<div>" + product[2]+ "</div>");
  node.append("<a href=places.html?id=" + k + ">Details</a>");
  return node;
 }
//Step 2 - add-review.html to IPFS
 function saveImageOnIpfs(reader) {
  return new Promise(function(resolve, reject) {
   const buffer = Buffer.from(reader.result);
   ipfs.add(buffer)
   .then((response) => {
    console.log(response)
    resolve(response[0].hash);
   }).catch((err) => {
    console.error("Image uploaded to IPFS: "+err)
    reject(err);
   })
  })
 }
 
 function saveTextBlobOnIpfs(blob) {
  return new Promise(function(resolve, reject) {
   const descBuffer = Buffer.from(blob, 'utf-8');
   ipfs.add(descBuffer)
   .then((response) => {
    console.log(response)
    resolve(response[0].hash);
   }).catch((err) => {
    console.error("Description written to IPFS: "+err)
    reject(err);
   })
  })
 }
// Step 3 - data from IPFS to blockchain
 function saveProduct(reader, decodedParams) {
  let imageId, descId;
  saveImageOnIpfs(reader).then(function(id) {
    imageId = id;
    saveTextBlobOnIpfs(decodedParams["product-description"]).then(function(id) {
      descId = id;
       saveProductToBlockchain(decodedParams, imageId, descId);
    })
 })
}

function saveProductToBlockchain(params, imageId, descId) {
  console.log(params);
  TripAdvisorAdd.deployed().then(function(i) {
    i.addPlaceReview(params["product-name"], params["product-category"], imageId, descId,5, {from: web3.eth.accounts[0], gas: 440000}).then(function(f) {
   console.log(f);
   $("#msg").show();
   $("#msg").html("Your review was successfully added to BlockChain!");
  })
 });
}

function renderProductDetails(productId) {
  TripAdvisorAdd.deployed().then(function(i) {
   i.getPlace.call(productId).then(function(p) {
    console.log(p);
    let content = "";
    $("#product-name").html(p[1].name);
    ipfs.cat(p[4]).then(function(file) {
     content = file.toString();
     $("#product-desc").append("<div>" + content+ "</div>");
    });
    
    $("#product-image").append("<img src='https://ipfs.io/ipfs/" + p[3] + "' width='250px' />");
    $("#product-id").val(p[0]);
  
   })
  })
 }