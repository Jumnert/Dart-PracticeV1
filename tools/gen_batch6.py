import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "dart"
OUT.mkdir(exist_ok=True)
FILES = {}

FILES["ex51.dart"] = r'''
// Exercise 51 - Function Composition: finalPrice() calls tax() and discount()

// ---------- INPUT ----------
const double amount = 800;

double tax(double amount) => amount * 0.10;

double discount(double amount) => amount >= 500 ? amount * 0.15 : 0;

double finalPrice(double amount) => amount + tax(amount) - discount(amount);

void main() {
  print('Amount      : \$${amount.toStringAsFixed(2)}');
  print('Tax (10%)   : \$${tax(amount).toStringAsFixed(2)}');
  print('Discount    : \$${discount(amount).toStringAsFixed(2)}');
  print('Final Price : \$${finalPrice(amount).toStringAsFixed(2)}');
}
'''

FILES["ex52.dart"] = r'''
// Exercise 52 - Student Result System

// ---------- INPUT ----------
const List<int> scores = [88, 76, 92, 64, 81];

double average(List<int> scores) =>
    scores.fold<int>(0, (sum, score) => sum + score) / scores.length;

String grade(double average) {
  if (average >= 90) return 'A';
  if (average >= 80) return 'B';
  if (average >= 70) return 'C';
  if (average >= 60) return 'D';
  return 'F';
}

void main() {
  final double avg = average(scores);

  print('Scores  : $scores');
  print('Average : ${avg.toStringAsFixed(2)}');
  print('Grade   : ${grade(avg)}');
  print('Status  : ${avg >= 60 ? 'Pass' : 'Fail'}');
}
'''

FILES["ex53.dart"] = r'''
// Exercise 53 - Calculator using lambda functions stored in variables

// ---------- INPUT ----------
const double x = 36;
const double y = 8;

void main() {
  final double Function(double, double) add = (a, b) => a + b;
  final double Function(double, double) subtract = (a, b) => a - b;
  final double Function(double, double) multiply = (a, b) => a * b;
  final double Function(double, double) divide = (a, b) => b == 0 ? 0 : a / b;

  print('$x + $y = ${add(x, y)}');
  print('$x - $y = ${subtract(x, y)}');
  print('$x * $y = ${multiply(x, y)}');
  print('$x / $y = ${divide(x, y)}');
}
'''

FILES["ex54.dart"] = r'''
// Exercise 54 - Dynamic Salary Report (named parameters with defaults)

// ---------- INPUT ----------
const double basicSalary = 1500;
const double allowanceAmount = 200;
const double overtimeAmount = 180;
const double bonusAmount = 120;
const double taxAmount = 210;

double salary({
  required double basic,
  double allowance = 0,
  double overtime = 0,
  double bonus = 0,
  double tax = 0,
}) =>
    basic + allowance + overtime + bonus - tax;

void main() {
  final double net = salary(
    basic: basicSalary,
    allowance: allowanceAmount,
    overtime: overtimeAmount,
    bonus: bonusAmount,
    tax: taxAmount,
  );

  print('Basic     : \$${basicSalary.toStringAsFixed(2)}');
  print('Allowance : \$${allowanceAmount.toStringAsFixed(2)}');
  print('Overtime  : \$${overtimeAmount.toStringAsFixed(2)}');
  print('Bonus     : \$${bonusAmount.toStringAsFixed(2)}');
  print('Tax       : \$${taxAmount.toStringAsFixed(2)}');
  print('Net Salary: \$${net.toStringAsFixed(2)}');
  print('Basic only: \$${salary(basic: basicSalary).toStringAsFixed(2)}');
}
'''

FILES["ex55.dart"] = r'''
// Exercise 55 - Anonymous functions with a collection (no for loop)

// ---------- INPUT ----------
const List<int> numbers = [5, 12, 8, 20, 15];

void main() {
  print('--- forEach ---');
  numbers.forEach((n) => print(n));

  print('--- where (even) ---');
  numbers.where((n) => n % 2 == 0).forEach((n) => print(n));

  print('--- map (x10) ---');
  numbers.map((n) => n * 10).forEach((n) => print(n));
}
'''

FILES["ex56.dart"] = r'''
// Exercise 56 - University Student Report System
// report() calls average(), grade() and isPass().

// ---------- INPUT ----------
const String studentName = 'Sok Dara';
const List<int> studentScores = [82, 76, 91, 68, 88]; // Khmer, English, Math, ICT, Science
const List<String> subjects = ['Khmer', 'English', 'Math', 'ICT', 'Science'];

double average(List<int> scores) =>
    scores.fold<int>(0, (sum, score) => sum + score) / scores.length;

String grade(double average) {
  if (average >= 90) return 'A';
  if (average >= 80) return 'B';
  if (average >= 70) return 'C';
  if (average >= 60) return 'D';
  return 'F';
}

bool isPass(double average) => average >= 60;

void report({
  required String name,
  required List<int> scores,
}) {
  final double avg = average(scores);

  print('Student Name : $name');
  print('Scores:');
  for (int i = 0; i < scores.length; i++) {
    print('${subjects[i].padRight(7)}: ${scores[i]}');
  }
  print('');
  print('Average : ${avg.toStringAsFixed(2)}');
  print('Grade   : ${grade(avg)}');
  print('Status  : ${isPass(avg) ? 'Pass' : 'Fail'}');
}

void main() {
  report(name: studentName, scores: studentScores);
}
'''

FILES["ex57.dart"] = r'''
// Exercise 57 - University Scholarship Evaluation System
// displayReport() calls calculateAverage(), grade() and isEligible().

// ---------- INPUT ----------
const String student = 'Chan Mealea';
const List<double> studentScores = [94, 91, 96, 89, 92];
const int studentAttendance = 97;
const bool hasDisciplinaryRecord = false;

double calculateAverage(List<double> scores) =>
    scores.fold<double>(0, (sum, score) => sum + score) / scores.length;

String grade(double average) => average >= 90
    ? 'A'
    : average >= 80
        ? 'B'
        : average >= 70
            ? 'C'
            : average >= 60
                ? 'D'
                : 'F';

bool isEligible({
  required double average,
  required int attendance,
  required bool disciplinaryRecord,
}) =>
    average >= 90 && attendance >= 95 && !disciplinaryRecord;

void displayReport({
  required String studentName,
  required List<double> scores,
  required int attendance,
  required bool disciplinaryRecord,
}) {
  final double avg = calculateAverage(scores);
  final bool eligible = isEligible(
    average: avg,
    attendance: attendance,
    disciplinaryRecord: disciplinaryRecord,
  );

  print('========== SCHOLARSHIP REPORT ==========');
  print('Student Name : $studentName');
  print('Average      : ${avg.toStringAsFixed(2)}');
  print('Grade        : ${grade(avg)}');
  print('Attendance   : $attendance %');
  print('Discipline   : ${disciplinaryRecord ? 'Bad' : 'Good'}');
  print('Scholarship  : ${eligible ? 'Eligible' : 'Not Eligible'}');
}

void main() {
  displayReport(
    studentName: student,
    scores: studentScores,
    attendance: studentAttendance,
    disciplinaryRecord: hasDisciplinaryRecord,
  );
}
'''

FILES["ex58.dart"] = r'''
// Exercise 58 - Online Shopping System
// totalPayment() calls subtotal(), discount() and shipping() - no duplicated math.

// ---------- INPUT ----------
const List<double> cart = [249.99, 320.50, 89.90, 410.00];
const bool useExpress = true;

double subtotal(List<double> prices) =>
    prices.fold<double>(0, (sum, price) => sum + price);

double discount(double subtotal) {
  if (subtotal >= 1000) return subtotal * 0.15;
  if (subtotal >= 500) return subtotal * 0.10;
  if (subtotal >= 200) return subtotal * 0.05;
  return 0;
}

double shipping({
  required double subtotal,
  bool express = false,
}) =>
    subtotal >= 1500 ? 0 : (express ? 25 : 10);

double totalPayment({
  required List<double> prices,
  bool express = false,
}) {
  final double sub = subtotal(prices);
  final double off = discount(sub);
  final double ship = shipping(subtotal: sub, express: express);

  print('Subtotal      : \$${sub.toStringAsFixed(2)}');
  print('Discount      : \$${off.toStringAsFixed(2)}');
  print('Shipping      : \$${ship.toStringAsFixed(2)}');

  return sub - off + ship;
}

void main() {
  final double total = totalPayment(prices: cart, express: useExpress);
  print('Total Payment : \$${total.toStringAsFixed(2)}');
}
'''

FILES["ex59.dart"] = r'''
// Exercise 59 - Employee Payroll Management System
// payrollReport() calls overtimePay(), grossSalary(), incomeTax() and netSalary().

// ---------- INPUT ----------
const String employee = 'Nhep Panha';
const double basic = 3200;
const double otHours = 12;
const double otRate = 9.5;
const double allowanceAmount = 300;

double overtimePay({
  required double hours,
  required double rate,
}) =>
    hours * rate;

double grossSalary({
  required double basicSalary,
  required double overtime,
  double allowance = 0,
}) =>
    basicSalary + overtime + allowance;

double incomeTax(double grossSalary) {
  if (grossSalary >= 5000) return grossSalary * 0.20;
  if (grossSalary >= 3000) return grossSalary * 0.15;
  if (grossSalary >= 1500) return grossSalary * 0.10;
  return grossSalary * 0.05;
}

double netSalary(double grossSalary) => grossSalary - incomeTax(grossSalary);

void payrollReport({
  required String employeeName,
  required double basicSalary,
  required double overtimeHours,
  required double overtimeRate,
  double allowance = 0,
}) {
  final double overtime = overtimePay(hours: overtimeHours, rate: overtimeRate);
  final double gross = grossSalary(
    basicSalary: basicSalary,
    overtime: overtime,
    allowance: allowance,
  );
  final double tax = incomeTax(gross);
  final double net = netSalary(gross);

  print('Employee Name : $employeeName');
  print('Basic Salary  : \$${basicSalary.toStringAsFixed(2)}');
  print('Overtime Pay  : \$${overtime.toStringAsFixed(2)}');
  print('Allowance     : \$${allowance.toStringAsFixed(2)}');
  print('Gross Salary  : \$${gross.toStringAsFixed(2)}');
  print('Income Tax    : \$${tax.toStringAsFixed(2)}');
  print('Net Salary    : \$${net.toStringAsFixed(2)}');
}

void main() {
  payrollReport(
    employeeName: employee,
    basicSalary: basic,
    overtimeHours: otHours,
    overtimeRate: otRate,
    allowance: allowanceAmount,
  );
}
'''

FILES["ex60.dart"] = r'''
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
'''

for name, body in FILES.items():
    (OUT / name).write_text(body.lstrip("\n"))
print("wrote", len(FILES), "files")
