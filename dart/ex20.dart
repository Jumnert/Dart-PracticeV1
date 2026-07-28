// Exercise 20 - Payroll Processing (10 employees x 12 months)

// ---------- INPUT ----------
const List<String> employees = [
  'Sokha', 'Dara', 'Vichea', 'Mealea', 'Rithy',
  'Chantha', 'Bopha', 'Kosal', 'Sreypov', 'Panha',
];
const List<String> months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const List<List<double>> monthlySalary = [
  [900, 900, 950, 950, 980, 980, 1000, 1000, 1020, 1020, 1050, 1200],
  [700, 700, 700, 720, 720, 750, 750, 780, 780, 800, 800, 900],
  [1500, 1500, 1550, 1550, 1600, 1600, 1650, 1650, 1700, 1700, 1750, 2000],
  [600, 620, 620, 650, 650, 680, 680, 700, 700, 720, 720, 850],
  [1100, 1100, 1150, 1150, 1180, 1180, 1200, 1200, 1250, 1250, 1300, 1500],
  [850, 850, 880, 880, 900, 900, 930, 930, 950, 950, 980, 1100],
  [1300, 1300, 1350, 1350, 1400, 1400, 1450, 1450, 1500, 1500, 1550, 1800],
  [500, 500, 520, 520, 540, 540, 560, 560, 580, 580, 600, 700],
  [1000, 1000, 1050, 1050, 1080, 1080, 1100, 1100, 1120, 1120, 1150, 1300],
  [750, 750, 780, 780, 800, 800, 820, 820, 850, 850, 880, 1000],
];

void main() {
  double companyPayroll = 0;
  double topYearly = -1;
  String topEmployee = '';

  for (int e = 0; e < employees.length; e++) {
    double yearly = 0;
    double highest = monthlySalary[e][0];
    double lowest = monthlySalary[e][0];
    String highestMonth = months[0];
    String lowestMonth = months[0];

    for (int m = 0; m < months.length; m++) {
      final double value = monthlySalary[e][m];
      yearly += value;
      if (value > highest) {
        highest = value;
        highestMonth = months[m];
      }
      if (value < lowest) {
        lowest = value;
        lowestMonth = months[m];
      }
    }

    companyPayroll += yearly;
    if (yearly > topYearly) {
      topYearly = yearly;
      topEmployee = employees[e];
    }

    print('${employees[e].padRight(8)} yearly: \$${yearly.toStringAsFixed(2).padLeft(9)}  '
        'avg: \$${(yearly / months.length).toStringAsFixed(2).padLeft(8)}  '
        'high: $highestMonth (\$${highest.toStringAsFixed(0)})  '
        'low: $lowestMonth (\$${lowest.toStringAsFixed(0)})');
  }

  print('');
  print('Company Yearly Payroll : \$${companyPayroll.toStringAsFixed(2)}');
  print('Top Earner             : $topEmployee (\$${topYearly.toStringAsFixed(2)})');
}
