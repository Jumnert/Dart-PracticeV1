import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "dart"
OUT.mkdir(exist_ok=True)
FILES = {}

FILES["ex29.dart"] = r'''
// Exercise 29 - Sum numbers until 0 (int stays int, double keeps decimals)

// ---------- INPUT (simulated keyboard entry) ----------
const List<num> inputs = [1, 2, 3, 4, 5, 0];

void main() {
  num sum = 0;
  int i = 0;

  while (i < inputs.length) {
    final num value = inputs[i];
    print('Input number to sum (0 to exit): $value');
    i++;
    if (value == 0) break;
    sum += value;
  }

  // If every entry was an int the total is printed without ".0".
  if (sum is int || sum == sum.truncate()) {
    print('Sum is: ${sum.truncate()}');
  } else {
    print('Sum is: $sum');
  }
}
'''

FILES["ex30.dart"] = r'''
// Exercise 30 - Digit analysis of a positive integer using while

// ---------- INPUT ----------
const int number = 752125;

void main() {
  int n = number;
  int count = 0;
  int sum = 0;
  int evens = 0;
  int odds = 0;
  int largest = 0;
  int smallest = 9;

  while (n > 0) {
    final int digit = n % 10;
    count++;
    sum += digit;
    if (digit % 2 == 0) {
      evens++;
    } else {
      odds++;
    }
    if (digit > largest) largest = digit;
    if (digit < smallest) smallest = digit;
    n = n ~/ 10;
  }

  print('Input number: $number');
  print('Count digit : $count');
  print('Sum         : $sum');
  print('Count even  : $evens');
  print('Count odd   : $odds');
  print('Largest     : $largest');
  print('Smallest    : $smallest');
}
'''

FILES["ex31.dart"] = r'''
// Exercise 31 - Digital root: keep adding digits until one digit remains

// ---------- INPUT ----------
const int number = 789456;

void main() {
  int current = number;
  print('Input positive number:$number');

  while (current >= 10) {
    print('Current number: $current');
    int sum = 0;
    int n = current;
    while (n > 0) {
      sum += n % 10;
      n = n ~/ 10;
    }
    print('Sum digits: $sum');
    current = sum;
  }

  print('Final sum digit: $current');
}
'''

FILES["ex32.dart"] = r'''
// Exercise 32 - ATM login with 3 attempts (while loop)

// ---------- INPUT (simulated PIN entries) ----------
const int correctPin = 1234;
const int maxAttempts = 3;
const List<int> entered = [1111, 4321, 1234];

void main() {
  int attempts = 0;
  bool granted = false;

  while (attempts < maxAttempts && !granted) {
    final int pin = entered[attempts];
    print('Enter PIN: $pin');
    attempts++;

    if (pin == correctPin) {
      granted = true;
    } else {
      print('Wrong PIN');
    }
  }

  if (granted) {
    print('Access Granted');
    print('Attempts used: $attempts');
  } else {
    print('Account Locked');
  }
}
'''

FILES["ex33.dart"] = r'''
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
'''

FILES["ex34.dart"] = r'''
// Exercise 34 - Perfect Number Analyzer (nested while, stops at -1)

// ---------- INPUT ----------
const List<int> inputs = [6, 28, 15, 496, -1];

void main() {
  int perfectCount = 0;
  int nonPerfectCount = 0;
  int largestPerfect = -1;
  int smallestPerfect = -1;
  int i = 0;

  while (i < inputs.length) {
    final int number = inputs[i];
    i++;
    print('Enter number (-1 to stop): $number');
    if (number == -1) break;

    // Inner while sums the proper divisors.
    int divisor = 1;
    int sum = 0;
    while (divisor <= number ~/ 2) {
      if (number % divisor == 0) sum += divisor;
      divisor++;
    }

    final bool isPerfect = sum == number && number > 0;
    if (isPerfect) {
      perfectCount++;
      if (largestPerfect == -1 || number > largestPerfect) largestPerfect = number;
      if (smallestPerfect == -1 || number < smallestPerfect) smallestPerfect = number;
      print('  $number is a Perfect Number');
    } else {
      nonPerfectCount++;
      print('  $number is Not Perfect (divisor sum = $sum)');
    }
  }

  print('');
  print('Perfect Numbers : $perfectCount');
  print('Non Perfect     : $nonPerfectCount');
  print('Largest Perfect : $largestPerfect');
  print('Smallest Perfect: $smallestPerfect');
}
'''

FILES["ex35.dart"] = r'''
// Exercise 35 - Student Grade Processing (do...while only, stops at -1)

// ---------- INPUT ----------
const List<int> scores = [95, 82, 71, 64, 55, 88, 91, 45, -1];

void main() {
  int count = 0;
  int highest = -1;
  int lowest = 101;
  int total = 0;
  int a = 0, b = 0, c = 0, d = 0, f = 0;
  int index = 0;
  int score;

  do {
    score = scores[index];
    index++;
    print('Enter score (-1 to stop): $score');
    if (score == -1) break;

    count++;
    total += score;
    if (score > highest) highest = score;
    if (score < lowest) lowest = score;

    if (score >= 90) {
      a++;
    } else if (score >= 80) {
      b++;
    } else if (score >= 70) {
      c++;
    } else if (score >= 60) {
      d++;
    } else {
      f++;
    }
  } while (index < scores.length);

  print('');
  print('Number of students : $count');
  print('Highest score      : $highest');
  print('Lowest score       : $lowest');
  print('Average score      : ${(total / count).toStringAsFixed(2)}');
  print('A (90-100)         : $a');
  print('B (80-89)          : $b');
  print('C (70-79)          : $c');
  print('D (60-69)          : $d');
  print('F (<60)            : $f');
  print('Pass Rate          : ${((count - f) / count * 100).toStringAsFixed(2)}%');
  print('Fail Rate          : ${(f / count * 100).toStringAsFixed(2)}%');
}
'''

FILES["ex36.dart"] = r'''
// Exercise 36 - Reverse Digit analysis (while only, no String conversion)

// ---------- INPUT ----------
const int number = 12321;

void main() {
  int n = number;
  int reverse = 0;
  int largest = 0;
  int smallest = 9;
  int count = 0;
  int sum = 0;
  int product = 1;

  while (n > 0) {
    final int digit = n % 10;
    reverse = reverse * 10 + digit;
    if (digit > largest) largest = digit;
    if (digit < smallest) smallest = digit;
    count++;
    sum += digit;
    product *= digit;
    n = n ~/ 10;
  }

  print('Original Number : $number');
  print('Reverse Number  : $reverse');
  print('Largest Digit   : $largest');
  print('Smallest Digit  : $smallest');
  print('Digit Count     : $count');
  print('Sum of Digits   : $sum');
  print('Product of Digits: $product');
  print('Palindrome      : ${reverse == number ? 'Yes' : 'No'}');
}
'''

FILES["ex37.dart"] = r'''
// Exercise 37 - Multiplication Table Analyzer
// Outer loop = while, inner loop = do...while.

// ---------- INPUT ----------
const int from = 2;
const int to = 12;
const int upTo = 12;

void main() {
  int table = from;
  int overallSum = 0;
  int overallCount = 0;
  int overallLargest = 0;
  int overallSmallest = 1 << 30;

  while (table <= to) {
    int i = 1;
    int sum = 0;
    int largest = 0;
    int smallest = 1 << 30;

    do {
      final int product = table * i;
      sum += product;
      if (product > largest) largest = product;
      if (product < smallest) smallest = product;
      i++;
    } while (i <= upTo);

    overallSum += sum;
    overallCount += upTo;
    if (largest > overallLargest) overallLargest = largest;
    if (smallest < overallSmallest) overallSmallest = smallest;

    print('Table ${table.toString().padLeft(2)} -> sum: ${sum.toString().padLeft(4)}  '
        'avg: ${(sum / upTo).toStringAsFixed(2).padLeft(6)}  '
        'largest: ${largest.toString().padLeft(3)}  smallest: ${smallest.toString().padLeft(2)}');
    table++;
  }

  print('');
  print('Overall Sum      : $overallSum');
  print('Overall Average  : ${(overallSum / overallCount).toStringAsFixed(2)}');
  print('Largest Product  : $overallLargest');
  print('Smallest Product : $overallSmallest');
}
'''

FILES["ex38.dart"] = r'''
// Exercise 38 - Number Guessing Tournament (do...while only, no for loop)
import 'dart:math';

// ---------- INPUT ----------
const int rounds = 10;
const int maxNumber = 100;
const int seed = 11;

void main() {
  final random = Random(seed);

  int round = 0;
  int totalAttempts = 0;
  int bestAttempts = 1 << 30;
  int worstAttempts = 0;
  int bestRound = 0;
  int worstRound = 0;

  do {
    round++;
    final int secret = random.nextInt(maxNumber) + 1;

    // The "player" plays a binary search: low/high narrowing.
    int low = 1;
    int high = maxNumber;
    int attempts = 0;
    int guess;

    do {
      guess = (low + high) ~/ 2;
      attempts++;
      if (guess < secret) {
        low = guess + 1;
      } else if (guess > secret) {
        high = guess - 1;
      }
    } while (guess != secret);

    totalAttempts += attempts;
    if (attempts < bestAttempts) {
      bestAttempts = attempts;
      bestRound = round;
    }
    if (attempts > worstAttempts) {
      worstAttempts = attempts;
      worstRound = round;
    }

    print('Round ${round.toString().padLeft(2)} : attempts used = $attempts, correct guess = $guess');
  } while (round < rounds);

  print('');
  print('Total Attempts   : $totalAttempts');
  print('Average Attempts : ${(totalAttempts / rounds).toStringAsFixed(2)}');
  print('Best Round       : Round $bestRound ($bestAttempts attempts)');
  print('Worst Round      : Round $worstRound ($worstAttempts attempts)');
}
'''

FILES["ex39.dart"] = r'''
// Exercise 39 - Sales Performance System
// Restriction: only while / do...while, no List and no Map.
// Simulated input comes from a switch-based feed instead of a collection.

// ---------- INPUT ----------
double nextSales(int index) => switch (index) {
      0 => 6200,
      1 => 4500,
      2 => 2800,
      3 => 850,
      4 => 5100,
      5 => 3300,
      6 => 1500,
      7 => 990,
      _ => -999,
    };

double commissionRate(double sales) {
  if (sales >= 5000) return 0.15;
  if (sales >= 3000) return 0.10;
  if (sales >= 1000) return 0.05;
  return 0.02;
}

void main() {
  int index = 0;
  int employees = 0;
  double totalSales = 0;
  double totalCommission = 0;
  double highestSale = -1;
  double lowestSale = -1;
  double highestCommission = -1;
  double lowestCommission = -1;
  int excellent = 0, good = 0, average = 0, poor = 0;

  double sales = nextSales(index);
  while (sales != -999) {
    print('Enter monthly sales (-999 to stop): \$${sales.toStringAsFixed(2)}');
    employees++;

    final double commission = sales * commissionRate(sales);
    totalSales += sales;
    totalCommission += commission;

    if (highestSale < 0 || sales > highestSale) highestSale = sales;
    if (lowestSale < 0 || sales < lowestSale) lowestSale = sales;
    if (highestCommission < 0 || commission > highestCommission) highestCommission = commission;
    if (lowestCommission < 0 || commission < lowestCommission) lowestCommission = commission;

    if (sales >= 5000) {
      excellent++;
    } else if (sales >= 3000) {
      good++;
    } else if (sales >= 1000) {
      average++;
    } else {
      poor++;
    }

    index++;
    sales = nextSales(index);
  }

  print('');
  print('Total employees    : $employees');
  print('Highest sale       : \$${highestSale.toStringAsFixed(2)}');
  print('Lowest sale        : \$${lowestSale.toStringAsFixed(2)}');
  print('Highest commission : \$${highestCommission.toStringAsFixed(2)}');
  print('Lowest commission  : \$${lowestCommission.toStringAsFixed(2)}');
  print('Total sales        : \$${totalSales.toStringAsFixed(2)}');
  print('Total commission   : \$${totalCommission.toStringAsFixed(2)}');
  print('Average sales      : \$${(totalSales / employees).toStringAsFixed(2)}');
  print('Average commission : \$${(totalCommission / employees).toStringAsFixed(2)}');
  print('Excellent (>=5000) : $excellent');
  print('Good (3000-4999)   : $good');
  print('Average (1000-2999): $average');
  print('Poor (<1000)       : $poor');
}
'''

FILES["ex40.dart"] = r'''
// Exercise 40 - Sum Until Zero

// ---------- INPUT ----------
const List<int> inputs = [10, 20, 30, 0];

void main() {
  int count = 0;
  int sum = 0;
  int i = 0;

  while (i < inputs.length) {
    final int value = inputs[i];
    i++;
    print('Enter integer (0 to stop): $value');
    if (value == 0) break;
    count++;
    sum += value;
  }

  print('');
  print('Total Numbers : $count');
  print('Sum : $sum');
  print('Average : ${count == 0 ? 0 : sum / count}');
}
'''

for name, body in FILES.items():
    (OUT / name).write_text(body.lstrip("\n"))
print("wrote", len(FILES), "files")
