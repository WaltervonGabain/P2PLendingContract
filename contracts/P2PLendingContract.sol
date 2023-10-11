// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract P2PLendingContract is ERC721 {

    struct Loan {
        uint256 id;
        address lender;     // Owner of the loan
        uint256 amount;     // (max) amount that can be borrowed
        uint256 fee;        // % that is received as bonus
        address borrower;
    }

    mapping (uint256 => Loan) private loans;  // Mapping of open loans
    uint256 private loanCount;                // Counts stack of loans
    uint256 public totalPayments;

    event LoanReceivedFrom(uint256 loanId, address lender);
    event LoanGivenTo(uint256 loanId, address borrower);
    event LoanPaidBy(uint256 loanId, address borrower, uint256 amountRemaining);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event PaymentReceived(address indexed sender, uint256 amount);

    constructor() ERC721("MyTokenName", "MTN") {
        loanCount = 0;
    }

    function payOut(address payable recipient, uint256 amount) internal {
        require(amount <= address(this).balance, "Insufficient funds");  // Ensure that the requested amount does not exceed the contract's balance

        recipient.transfer(amount); // Transfer the specified amount of Ether to the specified address

        emit FundsWithdrawn(recipient, amount); // Emit the FundsWithdrawn event
    }

    function addLoan(address lender, uint256 amount, uint256 fee) public { // Add a loan to loans
        require(amount > 0, "Loan amount has to be more than 0");
        require(fee <= 99, "Fee too high");

        loans[loanCount] = Loan(loanCount, lender, amount, fee, lender); // set it to owner of the loan to know its unused
        loanCount++;
        
        emit LoanReceivedFrom(loanCount-1, lender);
    }

    function takeLoan(uint256 loanId, address borrower) public {
        require(loanId < loanCount, "Took invalid loan"); // LoanId cannot be equal or bigger than load count

        Loan memory loan = loans[loanId];
        require(loan.lender != borrower, "Can't loan to self");

        address payable recipient = payable(borrower); // Ensure that borrower is of type address payable
        payOut(recipient, loan.amount);

        loans[loanId] = Loan(loanId, loan.lender, loan.amount, loan.fee, borrower); // Update the loan with the borrower
 
        emit LoanGivenTo(loanId, borrower);
    }

    function payLoan(uint256 loanId, uint256 amount) public {
        Loan memory loan = loans[loanId];
        require(loanId < loanCount, "Paid invalid loan");
        require(loan.amount > 0, "Loan is already paid off");
        
        uint256 decrease = amount - ((amount * loan.fee) / 100); // Calculate fee into amount being paid
        uint256 newLoanAmount = loan.amount - decrease;

        if (newLoanAmount < 10000) { // Remove dust from loan due to percentages and calculations (+- 2 cents)
            newLoanAmount = 0;
        }

        address payable recipient = payable(loan.lender); // Ensure that borrower is of type address payable
        payOut(recipient, loan.amount);

        loans[loanId] = Loan(loanId, loan.lender, newLoanAmount, loan.fee, loan.borrower); // Update the loan with the new amount

        emit LoanPaidBy(loanId, loan.borrower, loan.amount);
    }

    function receivePayment() external payable {
        require(msg.value > 0, "Invalid payment amount"); // Ensure that the received amount is greater than 0

        totalPayments += msg.value; // Increment the totalPayments variable with the received Ether

        emit PaymentReceived(msg.sender, msg.value);  // msg.value contains the amount of Ether sent in the transaction
    }

    function getLoans() public view returns (Loan[] memory) {
        Loan[] memory loanList = new Loan[](loanCount);

        for (uint256 i = 0; i < loanCount; i++) {
            loanList[i] = loans[i];
        }

        return loanList;
    }

}