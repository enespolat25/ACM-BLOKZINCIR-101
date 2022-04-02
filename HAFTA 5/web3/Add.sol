pragma solidity ^0.8.0;
 
contract Add{
   
    uint sum;
    function Sum(uint _num1, uint _num2) public{
        sum = _num1 + _num2;
       
    }
 
    function getSum() public view returns (uint){
        return  sum;
    }
}