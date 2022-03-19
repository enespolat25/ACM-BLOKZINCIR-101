// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Events {
    //struct
    struct Student {
        string name;
        bool attendence;
        int marks;
    }
    Student public newStudent;
    event studentRegistered(string name, bool attendence, int mark);

    function registerStudent( string memory _name, bool _attendence, int _marks) public{
        newStudent.name=_name;
        newStudent.attendence=_attendence;
        newStudent.marks=_marks;
        emit studentRegistered(_name,_attendence,_marks);
    }
}