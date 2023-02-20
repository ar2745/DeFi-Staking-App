//SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract Migrations {
    address public owner;
    uint public last_completed_migration;

    constructor() public {
        owner == msg.sender;
    }

    modifier restricted() {
        if(msg.sender == owner) {
            _;
        }
    }  

    function setCompleted(uint completed) restricted public {
        last_completed_migration = completed;
    }

    function upgrade(address new_address) restricted public {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}