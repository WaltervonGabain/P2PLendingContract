// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BorrowAndLendContract is ERC721 {

    //TODO -> Borrowers receive money but need to pay fees when returning the money.
        // 1) Borrow money function to call
        // 2) pay back money + fee
    //TODO -> Lenders pay money and receive money as a bonus. I’ll leave it up to you, how much, but be careful that it is not more than there is in the contract.
        // 1) Lend money function call

    struct Offer {
        address wallet; // Owner of the offer
        uint256 amount; // (max) amount that can be borrowed
        uint256 fee;    // % that is received as bonus
        address to;     // Borrowed to address
    }

    mapping (uint256 => Offer) private offers;  // Mapping of open offers
    uint256 private offerCount;                 // Counts stack of offers

    event OfferReceivedFrom(address owner);
    event OfferGivenTo(uint256 offerNumber, address to);

    constructor() ERC721("MyTokenName", "MTN") {
        offerCount = 0;
    }

    function lend(address wallet ,uint256 amount, uint256 fee) public { // Add an offer to offers
        // TODO require amount bigger than 0
        offers[offerCount].wallet = wallet;
        offers[offerCount].amount = amount;
        offers[offerCount].fee = fee;
        offers[offerCount].to = wallet;
        offerCount++;

        emit OfferReceivedFrom(wallet);
    }

    function borrow(address offerAddress, address to) public {
        uint256 offerId = getOfferId(offerAddress);
        // TODO require the offer number to be available (to undefined)
        require(offerId != offerCount, "Invalid offer");

        offers[offerId].to = to;

        emit OfferGivenTo(offerId, to);
    }

    function getOffers() public view returns (address[] memory) {
        address[] memory offerList = new address[](offerCount);

        for (uint256 i = 0; i < offerCount; i++) {
            offerList[i] = offers[i].wallet;
        }

        return offerList;
    }

    function getOfferId(
        address offerAddress
    ) private view returns (uint256) {
        for (uint256 i = 0; i < offerCount; i++) {
            if (offerAddress == offers[i].wallet) {
                return i;
            }
        }
        return offerCount;
    }

}