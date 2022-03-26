// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Country{
    string public name;
    string public flag;
    string private GDP;
    int public a;
    constructor(int _a){
        a=_a;
    }

}

contract Turkey {
    uint public sqkm;
    string public primeMinister;
    
}

contract US is Country, Turkey{
    uint public sqm;
    string public president;
    constructor(int _a) Country(_a*_a)public{
        
    }
}