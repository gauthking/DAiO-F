// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomNumberGenerator is VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256[10] public randomNumbers;
    uint256 public randomNumberCount;
    uint256 private latestRequestId;
    
    constructor(address _vrfCoordinator, address _linkToken, bytes32 _keyHash, uint256 _fee)
        VRFConsumerBase(_vrfCoordinator, _linkToken)
    {
        keyHash = _keyHash;
        fee = _fee;
    }
    
    function getRandomNumbers() external returns (uint256[10] memory) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK tokens");
        require(randomNumberCount < 10, "Maximum number of random numbers reached");
        
        bytes32 requestId = requestRandomness(keyHash, fee);
        latestRequestId = uint256(requestId);
        return randomNumbers;
    }
    
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        require(uint256(requestId) == latestRequestId, "Invalid request ID");
        
        randomNumbers[randomNumberCount] = randomness % 100; // Generate random number between 0 and 99
        randomNumberCount++;
        
        if (randomNumberCount < 10) {
            bytes32 newRequestId = requestRandomness(keyHash, fee);
            latestRequestId = uint256(newRequestId);
        }
    }
}