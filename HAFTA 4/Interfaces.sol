// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface Int{
    //cannot have variables
    //cannot inherit
    //can be inherited
    function recordName(string memory name) external;

}

contract A is Int{
    string[] public students;
    function recordName(string memory name) override public{
        students.push(name);

    }

}

contract B is Int {
    mapping(string=>bool) public students;

    function recordName(string memory name) override public{
        students[name]=true;

    }

}