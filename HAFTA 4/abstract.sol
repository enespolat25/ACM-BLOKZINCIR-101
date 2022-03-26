// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

abstract contract Ab{
    int public a;
    int public b;
    
    function abc() public{
        a=12; //implementation
        b=4;
    }
    function def() public view virtual returns(string memory);
    
}