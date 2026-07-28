// Exercise 43 - Employee Salary (named parameters)

// ---------- INPUT ----------
const double basic = 1200;
const double bonusAmount = 250;
const double taxAmount = 90;

double calculateSalary({
  required double basicSalary,
  double bonus = 0,
  double tax = 0,
}) =>
    basicSalary + bonus - tax;

void main() {
  final double net = calculateSalary(
    basicSalary: basic,
    bonus: bonusAmount,
    tax: taxAmount,
  );

  print('Basic Salary : \$${basic.toStringAsFixed(2)}');
  print('Bonus        : \$${bonusAmount.toStringAsFixed(2)}');
  print('Tax          : \$${taxAmount.toStringAsFixed(2)}');
  print('Net Salary   : \$${net.toStringAsFixed(2)}');
  print('No bonus/tax : \$${calculateSalary(basicSalary: basic).toStringAsFixed(2)}');
}
