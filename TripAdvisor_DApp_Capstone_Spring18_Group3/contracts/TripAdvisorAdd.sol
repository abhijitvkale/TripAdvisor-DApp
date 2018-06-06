
pragma solidity ^0.4.13;

contract TripAdvisorAdd {

    uint public placeIndex;
    uint public totalTokens; 
    uint public balanceTokens; 
    uint public tokenPrice; 

    mapping (address => mapping(uint => Place)) places;
    mapping (uint => address) placeIDinPortal; //Who added the place
    mapping (address => person) public personInfo;
    mapping (address => Place) public adderInfo;
    struct Place {
        uint id;
        string name;
        string category;
        string imageLink;
        string descLink;

        //Test
        address placeIdAdderAddress;
    }

    struct person {
        address personAddress; 
        uint tokensBought;    
    }
    //Constructor
    function TripAdvisorAdd(uint tokens, uint pricePerToken) public {
        placeIndex = 0;
        totalTokens = tokens;
        balanceTokens = tokens;
        tokenPrice = pricePerToken;
    }

    function buy() payable public 
    {
        uint tokensToBuy = msg.value / tokenPrice;
        require(tokensToBuy <= balanceTokens);
        personInfo[msg.sender].personAddress = msg.sender;
        personInfo[msg.sender].tokensBought += tokensToBuy;
        balanceTokens -= tokensToBuy;
        
    }
   
    function transferTo(address account) public {
        account.transfer(address(this).balance);
    }

    function tokensSold() view public returns (uint) {
        return totalTokens - balanceTokens;
    }

    function balanceTokensf() view public returns (uint) {
        return balanceTokens;
    }

    function personDetails(address user) view public returns (uint) {
        return (personInfo[user].tokensBought);
    }

    function totalReviews() view public returns (uint) {
        return placeIndex;
    }

    function addPlaceReview(string _name, string _category, string _imageLink, string _descLink, uint addreviewsInTokens) public  {
        personInfo[msg.sender].tokensBought -= addreviewsInTokens;
        balanceTokens += addreviewsInTokens;
        placeIndex += 1;
        
        Place memory place = Place(placeIndex, _name, _category, _imageLink, _descLink, msg.sender);
        places[msg.sender][placeIndex] = place;
        placeIDinPortal[placeIndex] = msg.sender;
    
    }

    function getPlace(uint _placeId) view public returns (uint, string, string, string, string) {
        Place memory place = places [placeIDinPortal[_placeId]][_placeId];
        return (place.id, place.name, place.category, place.imageLink, place.descLink);
    }
}
