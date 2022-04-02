// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract Lottery{
    address public manager;
    address payable[] public players;
    
    constructor() public {
        manager=msg.sender;
    }
    
    modifier onlyManager() {
        require(msg.sender==manager,"Only manager can call this function");
        _;
    }
    
    //Events
    event playerInvested(address player, uint amount);
    event winnerSelected(address winner, uint amount);
    
    
    //Invest money
    function invest() payable public {
        require(msg.sender!=manager," Manager cannot invest");
        //limit
        require(msg.value>=0.1 ether,"Invest minimum od 0.1 ether");//msg.value==3 ether
        players.push(payable(msg.sender));
        emit playerInvested(msg.sender, msg.value);
    }
    
    function getBalance() public view onlyManager returns(uint) {
        return address(this).balance;
    }
    
    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, players.length)));
    }
    
    function selectWinner()  public onlyManager {
        uint r=random();
        uint index=r%players.length;
        address payable winner= players[index];
        emit winnerSelected(winner, address(this).balance);
        winner.transfer(address(this).balance);
        players= new address payable[](0);
    }
    
    
}