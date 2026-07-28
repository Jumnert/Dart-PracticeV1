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
