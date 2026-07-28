// Exercise 33 - ATM Simulation with do...while menu

// ---------- INPUT (menu choice, amount) ----------
const double startingBalance = 1000;
const List<List<double>> actions = [
  [1, 500],   // deposit 500
  [2, 200],   // withdraw 200
  [2, 5000],  // withdraw too much -> failed
  [1, -50],   // invalid deposit
  [3, 0],     // check balance
  [9, 0],     // invalid menu
  [4, 0],     // exit
];

void main() {
  double balance = startingBalance;
  int deposits = 0;
  int withdrawals = 0;
  int failedWithdrawals = 0;
  int step = 0;
  int choice;

  do {
    print('===== ATM MENU =====');
    print('1. Deposit');
    print('2. Withdraw');
    print('3. Check Balance');
    print('4. Exit');

    choice = actions[step][0].toInt();
    final double amount = actions[step][1];
    step++;
    print('Choice: $choice');

    switch (choice) {
      case 1:
        if (amount > 0) {
          balance += amount;
          deposits++;
          print('Deposited \$${amount.toStringAsFixed(2)}');
        } else {
          print('Error: deposit must be positive');
        }
        break;
      case 2:
        if (amount > balance) {
          failedWithdrawals++;
          print('Error: insufficient balance');
        } else if (amount <= 0) {
          failedWithdrawals++;
          print('Error: withdrawal must be positive');
        } else {
          balance -= amount;
          withdrawals++;
          print('Withdrew \$${amount.toStringAsFixed(2)}');
        }
        break;
      case 3:
        print('Balance: \$${balance.toStringAsFixed(2)}');
        break;
      case 4:
        print('Exiting...');
        break;
      default:
        print('Error: invalid menu option');
    }
    print('');
  } while (choice != 4 && step < actions.length);

  print('===== SUMMARY =====');
  print('Final Balance       : \$${balance.toStringAsFixed(2)}');
  print('Number of Deposits  : $deposits');
  print('Number of Withdrawals: $withdrawals');
  print('Failed Withdrawals  : $failedWithdrawals');
}
