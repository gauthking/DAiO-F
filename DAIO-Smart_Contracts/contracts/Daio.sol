// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract DAiO is AutomationCompatibleInterface {
  struct Member {
    uint256 member_id;
    address member_address;
    address ai_Address;
  }

  struct Proposals {
    uint256 proposalId;
    string title;
    address initiator;
    uint256 forVotes;
    uint256 againstVotes;
    uint256 forPercentage;
    uint256 againstPercentage;
    bool status;
    uint256 timeInitiated;
    uint256 totalVotes;
    uint256 tillTime;
  }

  Member[] public members;
  Proposals[] public proposals;

  uint256 public _proposalId = 0;
  uint256 public _memberCount = 0;
  uint public immutable interval;
  uint public lastTimeStamp;

  mapping(address => bool) public registered;
  mapping(address => mapping(uint256 => bool)) public voted;
  mapping(address => mapping(uint256 => bool)) public votedAI;
  mapping(address => address) public aiOwner;
  mapping(address => address) public ownerAi;
  mapping(address => bool) public aiStatus;
  mapping(uint256 => bool) public completed;

  function checkRegistered() public view returns (bool) {
    return registered[msg.sender];
  }

  function proposalList() public view returns (Proposals[] memory) {
    return proposals;
  }

  function register(address ai_address, bool ai_status) public {
    require(registered[msg.sender] == false, "Already Registered");
    _memberCount++;
    members.push(Member(_memberCount, msg.sender, ai_address));
    aiOwner[ai_address] = msg.sender;
    ownerAi[msg.sender] = ai_address;
    registered[msg.sender] = true;
    aiStatus[ai_address] = ai_status;
  }

  function addProposal(string memory title, uint256 timeEnd) public {
    require(registered[msg.sender] == true, "Not registered");
    proposals.push(
      Proposals(
        _proposalId,
        title,
        msg.sender,
        0,
        0,
        0,
        0,
        true,
        block.timestamp,
        0,
        timeEnd
      )
    );
    _proposalId++;
  }

  constructor(uint256 updateInterval) {
    interval = updateInterval;
    lastTimeStamp = block.timestamp;
  }

  function voteOnproposal(uint256 proposalId, uint256 vote) public {
    require(registered[msg.sender] == true, "Not registered");
    require(proposals[proposalId].status == true, "Not Active");
    require(voted[msg.sender][proposalId] == false, "Already Voted");

    if (vote == 1) {
      proposals[proposalId].forVotes++;
      proposals[proposalId].totalVotes++;
    } else if (vote == 0) {
      proposals[proposalId].againstVotes++;
      proposals[proposalId].totalVotes++;
    }
    voted[msg.sender][proposalId] = true;
  }

  function voteOnproposalAI(uint256 proposalId, uint256 vote) public {
    address owner = aiOwner[msg.sender];
    require(registered[owner] == true, "Not registered");
    require(proposals[proposalId].totalVotes > 0, "Not Active");
    require(voted[owner][proposalId] == false, "Already Voted");
    require(aiStatus[msg.sender] == true, "AI not allowed");
    require(votedAI[msg.sender][proposalId] == false, "AI Already Voted");
    if (vote == 1) {
      proposals[proposalId].forVotes++;
    } else if (vote == 0) {
      proposals[proposalId].againstVotes++;
    }
    votedAI[msg.sender][proposalId] = true;
  }

  function revokeAI() public {
    require(registered[msg.sender] == true, "Not registered");
    require(aiStatus[ownerAi[msg.sender]] == true, "Already Revoked!");
    aiStatus[ownerAi[msg.sender]] = false;
  }

  function statusProposals() public payable {
    for (uint256 i = 0; i < _proposalId; i++) {
      if (
        (block.timestamp - proposals[i].timeInitiated) >=
        proposals[i].tillTime &&
        completed[i] == false
      ) {
        completed[i] = true;
        proposals[i].status = false;
      }
    }
  }

  function checkUpkeep(
    bytes memory /*checkData*/
  )
    public
    view
    override
    returns (bool upkeepNeeded, bytes memory /*performData*/)
  {
    upkeepNeeded = (block.timestamp - lastTimeStamp) >= interval;
  }

  function performUpkeep(bytes calldata performData) external override {
    (bool upkeepNeeded, ) = checkUpkeep("");

    require(upkeepNeeded == true, "Not needed!");
    if ((block.timestamp - lastTimeStamp) > interval) {
      lastTimeStamp = block.timestamp;
      statusProposals();
    }
  }
}
