// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./RandomAddress.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract DisputeHandler   {
     RandomNumberGenerator public randomNumberGenerator;
        bytes32 internal keyHash;
    uint256 internal fee;


    address parent_contract;
    enum DisputeState{
        complete  ,
        active,
        suspended,
        review

    }
    address owner;
    mapping(address=>bool) isAdmin;
    mapping(address=>uint256[]) userDisputes;
    uint256 index;
     address[] voters;
    mapping(uint256=>mapping(address=>bool)) isVoterAtDispute;
    mapping(uint256=>mapping(address=>bool)) voteStatusAtDispute;
        struct Dispute{
        uint id;
        uint256 expiryTimestamp;
        address registrar;//person registering dispute
        address secondary; //person being registered on
        string desc;
        string[] proofs; //proofs like screenshot stored in screenshot
        DisputeState status ;
        uint256 supportVotes;
        uint256 againstVotes;

    }
    mapping (uint256=>Dispute)  public disputesList;
    
     constructor(address _randomNumberGenerator)
        {

      owner=msg.sender;
 randomNumberGenerator = RandomNumberGenerator(_randomNumberGenerator);

        index=0;
        isAdmin[owner] =true;

        }
     modifier onlyAdmin {
      require(isAdmin[msg.sender]);
      _;
   }

    function setVoters(address[] memory participants) public onlyAdmin {
        //fetch paritcipants from contract and set voters section
        //or send it as arg if fetched from offchain
        // voters = [0x5c1a4F5AE38D4199868D53ad28B1095930a1485D];
        voters=participants;

    }

    function createDispute(address secondary,string memory desc,string[] memory proofs) public {
        Dispute memory newDispute =  Dispute(index,0,msg.sender,secondary,desc,proofs,DisputeState.active,0,0);
        disputesList[index]=newDispute;
        userDisputes[msg.sender].push(index);
        userDisputes[secondary].push(index);
       
        _startVoting(index);
         index++;

    }

    function _startVoting(uint256 disputeId) private {
    uint256[10]  memory randomNumbers;
     randomNumbers = randomNumberGenerator.getRandomNumbers();
     for(uint i=0;i<10;i++){
         isVoterAtDispute[disputeId][voters[randomNumbers[i]%100]]=true;
     }
     disputesList[disputeId].expiryTimestamp=block.timestamp+2 days;
     disputesList[disputeId].status=DisputeState.active;

    }


    function voteAtDispute(uint256 disputeId,bool voteFor) external {
        require(isVoterAtDispute[disputeId][msg.sender],"Not selected as VOTER");
        require(!voteStatusAtDispute[disputeId][msg.sender],"Vote completed");
        if(block.timestamp<=disputesList[disputeId].expiryTimestamp){
 if(voteFor){
            disputesList[disputeId].supportVotes ++;
        }
        else{
            disputesList[disputeId].againstVotes ++;
        }
        voteStatusAtDispute[disputeId][msg.sender]=true;
        }
        else{
            disputesList[disputeId].status = DisputeState.complete;
        }
       

    }

    function disableDispute(uint256 disputeId) external onlyAdmin {
        disputesList[disputeId].status=DisputeState.suspended;
    }

      function revertDisableDispute(uint256 disputeId) external onlyAdmin {
        disputesList[disputeId].status=DisputeState.active;
        disputesList[disputeId].expiryTimestamp =block.timestamp+1 days;
        //adds 2 more days due to time affected during suspension
    }



    





  
}