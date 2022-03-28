pragma solidity >=0.7.0 <0.9.0;

contract Variable2{
    //arrays
    string[] public names=["acm","berna","enes"];
    string[4] public names2=["acm","berna","enes","hacettepe"];
    
    //mapping ->dictionary key->values
    mapping(uint8=>uint8) public ogrenciler;
    
    //enums
    enum cities {Ankara, Istanbul, Bursa}
    cities public c1=cities.Bursa;
    
    //struct
    struct Ogrenci{
        string name;
        string surname;
        uint8 no;
    }
    Ogrenci public ogr1;
}