// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract P2PLendingContract is ERC721 {

    struct Loan {
        uint256 id;
        address lender;     // Owner of the loan
        uint256 amount;     // (max) amount that can be borrowed
        uint256 fee;        // % that is received as bonus
        address borrower;   // Borrower of the loan
    }

    mapping (uint256 => Loan) private loans;  // Mapping of open loans
    uint256 private loanCount;                // Counts stack of loans

    event LoanReceivedFrom(uint256 loanId, address lender);
    event LoanGivenTo(uint256 loanId, address borrower);
    event LoanPaidBy(uint256 loanId, address borrower, uint256 amountRemaining);


    constructor() ERC721("MyTokenName", "MTN") {
        loanCount = 0;
    }

    function addLoan(address lender ,uint256 amount, uint256 fee) public {  // Add an loan to loans
        require(amount > 0, "Invalid loan");                                // Loan amount has to be more than 0
        require(fee <= 99, "Fee too high");                                // Loan amount has to be more than 0

        loans[loanCount] = Loan(loanCount, lender, amount * 100, fee * 100, lender);    // set it to owner of the loan to know its unused
        loanCount++;                                                        // Increase loan number
        
        emit LoanReceivedFrom(loanCount-1, lender);
    }

    function takeLoan(uint256 loanId, address borrower) public {
        require(loanId < loanCount, "Took invalid loan");                        // LoanId cannot be equal or bigger than load count

        Loan memory loan = getLoan(loanId);
        require(loan.lender != borrower, "Can't loan to self");

        // TODO: receive amount (pay out from lender address)

        loans[loanId] = Loan(loanId, loan.lender, loan.amount, loan.fee, borrower);  // Update the loan with the new borrower
 
        emit LoanGivenTo(loanId, borrower);
    }

    function payLoan(uint256 loanId, uint256 amount) public {
        Loan memory loan = getLoan(loanId);
        require(loanId < loanCount, "Paid invalid loan");
        require(loan.amount > 0, "Loan is already paid off");
        
        uint256 decrease = amount - ((amount * loan.fee) / 10000);    // Calculate fee into amount being paid
        uint256 newLoanAmount = loan.amount - decrease;

        if (newLoanAmount < 100) {
            newLoanAmount = 0;
        }

        // TODO: pay off amount (pay out to lender address)

        loans[loanId] = Loan(loanId, loan.lender, newLoanAmount, loan.fee, loan.borrower); // Update the loan with the new amount

        emit LoanPaidBy(loanId, loan.borrower, loan.amount);
    }

    function getLoans() public view returns (Loan[] memory) {
        Loan[] memory loanList = new Loan[](loanCount);

        for (uint256 i = 0; i < loanCount; i++) {
            loanList[i] = loans[i];
        }

        return loanList;
    }

    function getLoan(uint loanId) public view returns (Loan memory) {
        return loans[loanId];
    }

}