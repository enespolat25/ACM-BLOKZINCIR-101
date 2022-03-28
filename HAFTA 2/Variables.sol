pragma solidity >=0.7.0 <0.9.0;

contract Variable{
    //tamsayilar 2^8  -128->127
    int8 public deger=127;
    //int için default 0
    uint8 public deger2=129;//0->255
    uint256 public buyukdeger;
    
    /*deger=20;
    
    değer değişikliği için gas ödenmeli fonksiyon çağrılmalı
    deger=10;*/
    //bool
    bool public tf;
    //bool varsayılan false;
    
    //string
    string public isim="miuul";
    
    //bytes
    bytes public bytedeger="ABC";//0x414243
    
    
}