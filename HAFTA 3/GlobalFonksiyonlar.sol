// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract GlobalFonksiyonlar {
    uint public msgValue;
    function getValues() public view returns(uint blockNumber, uint timestamp,
    address msgSender, bytes calldata msgData ) {
        return( block.number, block.timestamp, msg.sender, msg.data);
    }
    function payToContact() payable public{
        msgValue= msg.value;
    }
}