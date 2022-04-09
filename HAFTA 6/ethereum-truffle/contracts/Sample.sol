// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Sample {
    int sum;
    function Sum(int _a, int _b) public  {
        sum=_a+_b+2;
    }

    function getSum() public view returns(int){
        return sum;
    }
}