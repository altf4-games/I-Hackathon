// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HotelBooking is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Struct for Hotel
    struct Hotel {
        string name;
        string location;
        uint256 checkInTime;
        uint256 checkOutTime;
        uint256 roomNumber;
        bool checkedIn;
        bool checkedOut;
        uint256 loyaltyPoints;
        uint256 price;
    }

    struct User {
        uint256 totalLoyaltyPoints;
        mapping(uint256 => bool) hotelOwnership;
        uint256[] ownedHotels;  // Array to store tokenIds of hotels
    }

    // Mappings
    mapping(uint256 => Hotel) public hotels;
    mapping(address => User) public users;

    // Constants
    uint256 public constant MAX_LOYALTY_POINTS = 1000000;
    uint256 public constant BASE_LOYALTY_POINTS_HOTEL = 200;

    // Events
    event HotelBooked(address indexed to, uint256 tokenId, string name);
    event HotelCheckIn(uint256 tokenId);
    event HotelCheckOut(uint256 tokenId);
    event LoyaltyPointsUpdated(uint256 tokenId, uint256 newPoints);
    event BookingCancelled(uint256 tokenId);

    constructor() ERC721("HotelBookingToken", "HBT") Ownable(msg.sender) {}

    // Hotel Management Functions
    function bookHotel(
        address to,
        string memory hotelName,
        string memory location,
        uint256 checkInTime,
        uint256 checkOutTime,
        uint256 roomNumber,
        string memory tokenURI
    ) public payable returns (uint256) {
        require(to != address(0), "Invalid address");
        require(bytes(hotelName).length > 0, "Hotel name required");
        require(checkInTime > block.timestamp, "Invalid check-in time");
        require(checkOutTime > checkInTime, "Invalid check-out time");
        require(roomNumber > 0, "Invalid room number");

        uint256 price = msg.value; // Assuming the msg.value is the price for simplicity
        require(price > 0, "Price must be greater than zero");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);

        hotels[newItemId] = Hotel({
            name: hotelName,
            location: location,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            roomNumber: roomNumber,
            checkedIn: false,
            checkedOut: false,
            loyaltyPoints: BASE_LOYALTY_POINTS_HOTEL,
            price: price
        });
        
        users[to].totalLoyaltyPoints += BASE_LOYALTY_POINTS_HOTEL;
        users[to].hotelOwnership[newItemId] = true;
        users[to].ownedHotels.push(newItemId);

        emit HotelBooked(to, newItemId, hotelName);
        return newItemId;
    }

    function getHotelsByOwner(address owner) public view returns (uint256[] memory) {
        return users[owner].ownedHotels;
    }

    function hotelCheckIn(uint256 tokenId) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(block.timestamp >= hotels[tokenId].checkInTime, "Check-in time not reached");
        require(!hotels[tokenId].checkedIn, "Already checked in");
        
        hotels[tokenId].checkedIn = true;
        emit HotelCheckIn(tokenId);
    }

    function hotelCheckOut(uint256 tokenId) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(hotels[tokenId].checkedIn, "Not checked in");
        require(!hotels[tokenId].checkedOut, "Already checked out");
        require(block.timestamp <= hotels[tokenId].checkOutTime, "Check-out time passed");

        hotels[tokenId].checkedOut = true;
        emit HotelCheckOut(tokenId);
    }

    function cancelBooking(uint256 tokenId) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!hotels[tokenId].checkedIn, "Cannot cancel after check-in");

        address owner = ownerOf(tokenId);
        uint256 price = hotels[tokenId].price;

        // Refund the booking amount
        payable(owner).transfer(price);

        // Remove the hotel booking details
        delete hotels[tokenId];

        // Remove from user's ownership
        users[owner].hotelOwnership[tokenId] = false;
        uint256[] storage ownedHotels = users[owner].ownedHotels;
        for (uint256 i = 0; i < ownedHotels.length; i++) {
            if (ownedHotels[i] == tokenId) {
                ownedHotels[i] = ownedHotels[ownedHotels.length - 1];
                ownedHotels.pop();
                break;
            }
        }

        _burn(tokenId);
        emit BookingCancelled(tokenId);
    }

    // Loyalty Points Management
    function updateLoyaltyPoints(uint256 tokenId, uint256 newPoints) public onlyOwner {
        require(newPoints <= MAX_LOYALTY_POINTS, "Exceeds max loyalty points");
        
        address owner = ownerOf(tokenId);
        uint256 oldPoints = hotels[tokenId].loyaltyPoints;
        
        if (newPoints > oldPoints) {
            users[owner].totalLoyaltyPoints += newPoints - oldPoints;
        } else {
            require(users[owner].totalLoyaltyPoints >= oldPoints - newPoints, "Insufficient points");
            users[owner].totalLoyaltyPoints -= oldPoints - newPoints;
        }
        
        hotels[tokenId].loyaltyPoints = newPoints;
        emit LoyaltyPointsUpdated(tokenId, newPoints);
    }

    // View Functions
    function getHotelDetails(uint256 tokenId) public view returns (
        string memory name,
        string memory location,
        uint256 checkInTime,
        uint256 checkOutTime,
        uint256 roomNumber,
        bool checkedIn,
        bool checkedOut,
        uint256 loyaltyPoints,
        uint256 price
    ) {
        Hotel storage hotel = hotels[tokenId];
        return (
            hotel.name,
            hotel.location,
            hotel.checkInTime,
            hotel.checkOutTime,
            hotel.roomNumber,
            hotel.checkedIn,
            hotel.checkedOut,
            hotel.loyaltyPoints,
            hotel.price
        );
    }

    function getUserLoyaltyPoints(address user) public view returns (uint256) {
        return users[user].totalLoyaltyPoints;
    }
}