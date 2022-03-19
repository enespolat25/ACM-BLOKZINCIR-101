// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Odemeler {
    address public owner;
    address payable public investor;
    //Modifier
    modifier onlyOwner(){
        require(msg.sender==owner,"Ancak kontratin sahibi cagirabilir");
        _;

    }
    
    function payMoney() external payable {

    }
    constructor() public {
        owner=msg.sender;
    }

    function getBalance() public onlyOwner view returns(uint){
       
        //require(msg.sender==owner,"Ancak kontratin sahibi cagirabilir");
        return address(this).balance;
        
    }


    function sendMoney() external onlyOwner payable{
        //require(msg.sender==owner,"Ancak kontratin sahibi cagirabilir");
        investor=payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
        investor.transfer(2 ether);
        address payable investor2=payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db);
        investor2.transfer(1.5 ether);

    }

}