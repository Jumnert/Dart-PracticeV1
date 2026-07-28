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
