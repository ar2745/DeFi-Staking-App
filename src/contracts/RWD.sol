//SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.0 < 0.9.0;

contract RWD {
    string public name = "Reward Token";
    string public symbol = "RWD";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
    uint8 public decimals = 18;

    event Transfer(address indexed _from, address indexed _to, uint _value);

    event Approve(address indexed _owner, address indexed _spender, uint _value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        // Require that the value is greater than or equal for transfer
        require(balanceOf[msg.sender] >= _value);

        // Transfer the amount and subrtact the balance
        balanceOf[msg.sender] -= _value;

        // Add the balance
        balanceOf[_to] += _value;

        // Emit Tranfer event 
        emit Transfer(msg.sender, _to, _value);

        // Return True for boolean
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        allowance[msg.sender][_from] -= _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns(bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approve(msg.sender, _spender, _value);
        
        return true;
    }
}