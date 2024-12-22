// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Travel3Booking is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Struct for Ticket
    struct Ticket {
        string travelType;
        string details;
        uint256 departureTime;
        uint256 validityPeriod;
        bool used;
        uint256 benefits;
        uint256 loyaltyPoints;
        uint256 insuranceClaimTime;
        bool isInsuranceProcessed;
        uint256 price;
    }

    struct User {
        uint256 totalLoyaltyPoints;
        mapping(uint256 => bool) ticketOwnership;
        uint256[] ownedTickets; // Array to store tokenIds of tickets
    }

    // Mappings
    mapping(uint256 => Ticket) public tickets;
    mapping(address => User) public users;

    // Constants
    uint256 public constant MAX_LOYALTY_POINTS = 1000000;
    uint256 public constant BASE_LOYALTY_POINTS_TICKET = 100;

    // Events
    event TicketMinted(address indexed to, uint256 tokenId, string travelType);
    event TicketUsed(uint256 tokenId);
    event TicketTransferred(
        address indexed from,
        address indexed to,
        uint256 tokenId
    );
    event InsuranceClaimInitiated(uint256 tokenId);
    event InsuranceClaimProcessed(uint256 tokenId, uint256 amount);
    event BenefitsAdded(uint256 tokenId, uint256 newBenefits);
    event LoyaltyPointsUpdated(uint256 tokenId, uint256 newPoints);

    constructor() ERC721("Travel3Ticket", "T3T") Ownable(msg.sender) {}

    // Ticket Management Functions
    function bookTicket(
        address to,
        string memory travelType,
        string memory details,
        uint256 departureTime,
        uint256 validityPeriod,
        uint256 benefits,
        string memory tokenURI
    ) public payable returns (uint256) {
        require(to != address(0), "Invalid address");
        require(bytes(travelType).length > 0, "Travel type required");
        require(departureTime > block.timestamp, "Invalid departure time");
        require(validityPeriod > 0, "Invalid validity period");

        uint256 price = msg.value; // Assuming the msg.value is the price for simplicity
        require(price > 0, "Price must be greater than zero");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);

        tickets[newItemId] = Ticket({
            travelType: travelType,
            details: details,
            departureTime: departureTime,
            validityPeriod: validityPeriod,
            used: false,
            benefits: benefits,
            loyaltyPoints: BASE_LOYALTY_POINTS_TICKET,
            insuranceClaimTime: 0,
            isInsuranceProcessed: false,
            price: price
        });

        users[to].totalLoyaltyPoints += BASE_LOYALTY_POINTS_TICKET;
        users[to].ticketOwnership[newItemId] = true;
        users[to].ownedTickets.push(newItemId);
        emit TicketMinted(to, newItemId, travelType);
        return newItemId;
    }

    function getTicketsByOwner(
        address owner
    ) public view returns (uint256[] memory) {
        return users[owner].ownedTickets;
    }

    function useTicket(uint256 tokenId) public nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!tickets[tokenId].used, "Ticket has already been used");
        require(
            block.timestamp <
                tickets[tokenId].departureTime +
                    tickets[tokenId].validityPeriod,
            "Ticket has expired"
        );

        tickets[tokenId].used = true;
        emit TicketUsed(tokenId);
    }

    function transferTicket(
        address from,
        address to,
        uint256 tokenId
    ) public nonReentrant {
        require(to != address(0), "Invalid recipient address");
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == from, "Not the owner");
        require(!tickets[tokenId].used, "Cannot transfer a used ticket");
        require(
            block.timestamp <
                tickets[tokenId].departureTime +
                    tickets[tokenId].validityPeriod,
            "Ticket has expired"
        );

        _transfer(from, to, tokenId);

        users[from].ticketOwnership[tokenId] = false;
        users[to].ticketOwnership[tokenId] = true;

        emit TicketTransferred(from, to, tokenId);
    }

    function addBenefits(
        uint256 tokenId,
        uint256 newBenefits
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(!tickets[tokenId].used, "Cannot add benefits to a used ticket");

        tickets[tokenId].benefits |= newBenefits;
        emit BenefitsAdded(tokenId, newBenefits);
    }

    // Loyalty Points Management

    function updateLoyaltyPoints(
        uint256 tokenId,
        uint256 newPoints
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(newPoints <= MAX_LOYALTY_POINTS, "Exceeds max loyalty points");

        address owner = ownerOf(tokenId);
        uint256 oldPoints = tickets[tokenId].loyaltyPoints;

        if (newPoints > oldPoints) {
            users[owner].totalLoyaltyPoints += newPoints - oldPoints;
        } else {
            require(
                users[owner].totalLoyaltyPoints >= oldPoints - newPoints,
                "Insufficient points"
            );
            users[owner].totalLoyaltyPoints -= oldPoints - newPoints;
        }

        tickets[tokenId].loyaltyPoints = newPoints;
        emit LoyaltyPointsUpdated(tokenId, newPoints);
    }

    function decreaseLoyaltyPoints(
        uint256 tokenId,
        uint256 pointsToDeduct
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(
            pointsToDeduct > 0,
            "Points to deduct must be greater than zero"
        );

        address owner = ownerOf(tokenId);
        Ticket storage ticket = tickets[tokenId];
        uint256 currentPoints = ticket.loyaltyPoints;

        require(
            users[owner].totalLoyaltyPoints >= pointsToDeduct,
            "User has insufficient loyalty points"
        );
        require(
            currentPoints >= pointsToDeduct,
            "Not enough points assigned to this ticket"
        );

        // Update loyalty points at the ticket and user levels
        ticket.loyaltyPoints -= pointsToDeduct;
        users[owner].totalLoyaltyPoints -= pointsToDeduct;

        emit LoyaltyPointsUpdated(tokenId, ticket.loyaltyPoints);
    }

    // Insurance Management

    function initiateInsuranceClaim(uint256 tokenId) public nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            !tickets[tokenId].isInsuranceProcessed,
            "Insurance already processed"
        );

        tickets[tokenId].insuranceClaimTime = block.timestamp;
        emit InsuranceClaimInitiated(tokenId);
    }

    function processInsuranceClaim(uint256 tokenId, uint256 amount) public {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(tickets[tokenId].insuranceClaimTime > 0, "No claim initiated");
        require(
            !tickets[tokenId].isInsuranceProcessed,
            "Claim already processed"
        );

        tickets[tokenId].isInsuranceProcessed = true;
        emit InsuranceClaimProcessed(tokenId, amount);
    }

    // View Functions

    function isTicketValid(uint256 tokenId) public view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return
            !tickets[tokenId].used &&
            block.timestamp <
            tickets[tokenId].departureTime + tickets[tokenId].validityPeriod;
    }

    function getTicketBenefits(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tickets[tokenId].benefits;
    }

    function getUserLoyaltyPoints(address user) public view returns (uint256) {
        return users[user].totalLoyaltyPoints;
    }

    function getTicketDetails(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory travelType,
            string memory details,
            uint256 departureTime,
            uint256 validityPeriod,
            bool used,
            uint256 benefits,
            uint256 loyaltyPoints,
            uint256 insuranceClaimTime,
            bool isInsuranceProcessed
        )
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        Ticket storage ticket = tickets[tokenId];
        return (
            ticket.travelType,
            ticket.details,
            ticket.departureTime,
            ticket.validityPeriod,
            ticket.used,
            ticket.benefits,
            ticket.loyaltyPoints,
            ticket.insuranceClaimTime,
            ticket.isInsuranceProcessed
        );
    }
}