// Exercise 60 - Banking Transaction Analyzer
// bankReport() calls every other function; totals use fold() with lambdas.

// ---------- INPUT ----------
const String holder = 'Keo Sreypov';
const double opening = 4200;
const List<double> transactions = [1500, -300, 2200, -750, 900, -1200];

double totalDeposit(List<double> transactions) => transactions
    .where((t) => t > 0)
    .fold<double>(0, (sum, t) => sum + t);

double totalWithdrawal(List<double> transactions) => transactions
    .where((t) => t < 0)
    .fold<double>(0, (sum, t) => sum + t.abs());

double currentBalance({
  required double openingBalance,
  required List<double> deposits,
  required List<double> withdrawals,
}) =>
    openingBalance +
    deposits.fold<double>(0, (sum, d) => sum + d) -
    withdrawals.fold<double>(0, (sum, w) => sum + w.abs());

String accountStatus(double balance) {
  if (balance >= 10000) return 'Platinum';
  if (balance >= 5000) return 'Gold';
  if (balance >= 1000) return 'Silver';
  return 'Standard';
}

void bankReport({
  required String accountName,
  required double openingBalance,
  required List<double> deposits,
  required List<double> withdrawals,
}) {
  final double balance = currentBalance(
    openingBalance: openingBalance,
    deposits: deposits,
    withdrawals: withdrawals,
  );

  print('========== BANK REPORT ==========');
  print('Account Holder    : $accountName');
  print('Opening Balance   : \$${openingBalance.toStringAsFixed(2)}');
  print('Total Deposits    : \$${totalDeposit(deposits).toStringAsFixed(2)}');
  print('Total Withdrawals : \$${totalWithdrawal(withdrawals).toStringAsFixed(2)}');
  print('Current Balance   : \$${balance.toStringAsFixed(2)}');
  print('Account Status    : ${accountStatus(balance)}');
}

void main() {
  final deposits = transactions.where((t) => t > 0).toList();
  final withdrawals = transactions.where((t) => t < 0).toList();

  bankReport(
    accountName: holder,
    openingBalance: opening,
    deposits: deposits,
    withdrawals: withdrawals,
  );
}
