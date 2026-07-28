// Exercise 11 - Employee Salary Report (20 employees)

// ---------- INPUT ----------
const List<double> salaries = [
  450, 1200, 980, 760, 505, 320, 2100, 1750, 640, 890,
  1100, 470, 1330, 1580, 700, 415, 2450, 960, 1020, 530,
];

void main() {
  double total = 0;
  double highest = salaries[0];
  double lowest = salaries[0];

  print('--- All Salaries ---');
  for (int i = 0; i < salaries.length; i++) {
    print('Employee ${(i + 1).toString().padLeft(2)} : \$${salaries[i].toStringAsFixed(2)}');
    total += salaries[i];
    if (salaries[i] > highest) highest = salaries[i];
    if (salaries[i] < lowest) lowest = salaries[i];
  }

  final double average = total / salaries.length;

  int aboveAverage = 0;
  int below500 = 0;
  for (int i = 0; i < salaries.length; i++) {
    if (salaries[i] > average) aboveAverage++;
    if (salaries[i] < 500) below500++;
  }

  print('');
  print('--- Summary ---');
  print('Employees        : ${salaries.length}');
  print('Total Salary     : \$${total.toStringAsFixed(2)}');
  print('Average Salary   : \$${average.toStringAsFixed(2)}');
  print('Highest Salary   : \$${highest.toStringAsFixed(2)}');
  print('Lowest Salary    : \$${lowest.toStringAsFixed(2)}');
  print('Above Average    : $aboveAverage');
  print('Below \$500       : $below500');
}
