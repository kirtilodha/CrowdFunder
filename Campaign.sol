pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public{
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals; //who voted
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers; //who donated
    uint public approversCount;
    
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
    function Campaign(uint minimum, address creator) public {
        manager= creator;
        minimumContribution= minimum;
    }
    function contribute() public payable{
        require(msg.value > minimumContribution);
    approvers[msg.sender]= true;
    approversCount++;
    }
    function createRequests(string description, uint value, address recipient)
        public restricted{
        Request memory newRequest = Request({ //request creates a copy in memory, to point in same place, we put memory word before newRequest to make it point to same place.
            description : description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }
    function approveRequests(uint index) public{
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender]=true;
        request.approvalCount++;
        
    }
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        
        require(request.approvalCount> (approversCount/2));
        require(!request.complete); //has to be false
        
        request.recipient.transfer(request.value);
        request.complete= true;   
    }
} 

