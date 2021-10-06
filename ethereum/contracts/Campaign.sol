pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public{
        address newCampaign = new Campaign(minimum, msg.sender); //returns address
        deployedCampaigns.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns (address[]){ //view means can't modify
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount; //who voted yes
        mapping(address => bool) approvals; //voted or not
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers; //contributors
    uint public approversCount; //all voters
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address creator) public{
        manager = creator;
        minimumContribution = minimum;
    }
    function contribute() public payable{
        require(msg.value> minimumContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    function createRequest(string description, uint value, address recipient) public restricted{
         Request memory newRequest = Request({
             description: description,
             value : value,
             recipient: recipient,
             complete: false,
             approvalCount: 0
         });
         requests.push(newRequest);
    }
    function approveRequest(uint index) public{
        require(approvers[msg.sender]); //should be contributor
        require(!requests[index].approvals[msg.sender]); //should not be voted
        
        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;
    }
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    function getSummary() public view returns(
        uint, uint, uint, uint, address
    ){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approvers Count,
            manager
        );
    }
    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }
}