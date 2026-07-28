// Exercise 6 - Banking Loan Approval
// Nested if-else decision tree with a reason for every branch.

// ---------- INPUT ----------
const int creditScore = 720;
const double monthlyIncome = 4500;
const double existingDebtPercent = 30;
const int employmentYears = 3;

void main() {
  String status;
  String reason;

  if (creditScore < 600) {
    status = 'Rejected';
    reason = 'Credit score below 600';
  } else if (monthlyIncome >= 4000) {
    if (existingDebtPercent < 35) {
      if (employmentYears >= 2) {
        status = 'Approved';
        reason = 'Strong income, low debt and stable employment';
      } else {
        status = 'Conditional Approval';
        reason = 'Employment history under 2 years';
      }
    } else {
      status = 'Rejected';
      reason = 'Existing debt is 35% or more';
    }
  } else if (creditScore >= 750) {
    status = 'Conditional Approval';
    reason = 'Excellent credit score but income below \$4000';
  } else {
    status = 'Rejected';
    reason = 'Income below \$4000 and credit score under 750';
  }

  print('Credit Score    : $creditScore');
  print('Monthly Income  : \$${monthlyIncome.toStringAsFixed(2)}');
  print('Existing Debt   : ${existingDebtPercent.toStringAsFixed(0)}%');
  print('Employment      : $employmentYears year(s)');
  print('Loan Status     : $status');
  print('Reason          : $reason');
}
