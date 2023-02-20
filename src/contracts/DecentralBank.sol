//SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;
    address [] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    } 

    // Staking function
    function depositTokens(uint amount) public {
        // Require staking amount to be greater than zero
        require(amount > 0, "Amount cannot be 0");
        
        //Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), amount);
       
        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + amount;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking balance
        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        // Require the amount to be greater than zero
        require(balance > 0, "Staking balance cannot be less than 0");

        // Transfer the tokens to the specified contract address from bank
        tether.transfer(msg.sender, balance);

        // Update the staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaked[msg.sender] = false;
    }

    // Issue reward
    function issueTokens() public {
        require(msg.sender == owner, "Caller must be the owner");

        for(uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                rwd.transfer(recipient, balance / 10);
            }
        } 
    }
}
