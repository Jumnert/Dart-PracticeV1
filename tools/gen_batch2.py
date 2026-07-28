import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "dart"
OUT.mkdir(exist_ok=True)
FILES = {}

FILES["ex11.dart"] = r'''
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
'''

FILES["ex12.dart"] = r'''
// Exercise 12 - Student Grade Analyzer (10 students x 5 subjects, nested loops)

// ---------- INPUT ----------
const List<String> names = [
  'Sokha', 'Dara', 'Vichea', 'Mealea', 'Rithy',
  'Chantha', 'Bopha', 'Kosal', 'Sreypov', 'Panha',
];
const List<List<int>> marks = [
  [88, 92, 79, 85, 90],
  [55, 62, 48, 70, 58],
  [75, 80, 68, 72, 77],
  [95, 98, 91, 89, 94],
  [45, 52, 39, 60, 48],
  [82, 78, 85, 80, 88],
  [67, 71, 63, 69, 74],
  [90, 85, 88, 92, 87],
  [58, 61, 55, 64, 59],
  [73, 69, 78, 75, 71],
];

String gradeOf(double average) {
  if (average >= 90) return 'A';
  if (average >= 80) return 'B';
  if (average >= 70) return 'C';
  if (average >= 60) return 'D';
  return 'F';
}

void main() {
  double highestAvg = -1;
  double lowestAvg = 101;
  String bestStudent = '';
  String worstStudent = '';
  double classTotal = 0;
  int passed = 0;
  int failed = 0;

  for (int s = 0; s < marks.length; s++) {
    int total = 0;
    for (int j = 0; j < marks[s].length; j++) {
      total += marks[s][j];
    }
    final double average = total / marks[s].length;
    final String grade = gradeOf(average);

    print('${names[s].padRight(8)} total: ${total.toString().padLeft(3)}  '
        'avg: ${average.toStringAsFixed(2).padLeft(6)}  grade: $grade');

    classTotal += average;
    if (average > highestAvg) {
      highestAvg = average;
      bestStudent = names[s];
    }
    if (average < lowestAvg) {
      lowestAvg = average;
      worstStudent = names[s];
    }
    if (average >= 60) {
      passed++;
    } else {
      failed++;
    }
  }

  print('');
  print('Highest Average : ${highestAvg.toStringAsFixed(2)} ($bestStudent)');
  print('Lowest Average  : ${lowestAvg.toStringAsFixed(2)} ($worstStudent)');
  print('Class Average   : ${(classTotal / marks.length).toStringAsFixed(2)}');
  print('Passed          : $passed');
  print('Failed          : $failed');
}
'''

FILES["ex13.dart"] = r'''
// Exercise 13 - Star pattern: left edge + diagonal + full bottom row.

// ---------- INPUT ----------
const int n = 7;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      if (row == n) {
        line += '*';
      } else if (col == 1 || col == row) {
        line += '*';
      } else if (col < row) {
        line += ' ';
      }
    }
    print(line);
  }
}
'''

FILES["ex14.dart"] = r'''
// Exercise 14 - Multiplication tables from 2 to 20 (nested for loops).

// ---------- INPUT ----------
const int from = 2;
const int to = 20;
const int upTo = 12;

void main() {
  for (int table = from; table <= to; table++) {
    print('--- Table of $table ---');
    for (int i = 1; i <= upTo; i++) {
      print('${table.toString().padLeft(2)} x ${i.toString().padLeft(2)} = ${(table * i).toString().padLeft(3)}');
    }
    print('');
  }
}
'''

FILES["ex15.dart"] = r'''
// Exercise 15 - Sales Report (12 months x 5 products, nested loops)

// ---------- INPUT ----------
const List<String> products = ['Laptop', 'Phone', 'Tablet', 'Watch', 'Camera'];
const List<List<double>> sales = [
  // Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
  [120, 135, 150, 128, 142, 160, 155, 148, 138, 170, 190, 210],
  [300, 280, 320, 340, 360, 355, 370, 390, 380, 410, 450, 500],
  [90, 85, 100, 95, 110, 105, 120, 115, 108, 125, 140, 150],
  [60, 55, 70, 65, 80, 75, 90, 85, 78, 95, 110, 120],
  [40, 38, 45, 42, 50, 48, 55, 52, 47, 60, 70, 80],
];
const List<String> months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

void main() {
  print('--- Monthly Totals ---');
  double highestMonthlySale = -1;
  String highestMonthlyLabel = '';

  for (int m = 0; m < months.length; m++) {
    double monthTotal = 0;
    for (int p = 0; p < products.length; p++) {
      monthTotal += sales[p][m];
      if (sales[p][m] > highestMonthlySale) {
        highestMonthlySale = sales[p][m];
        highestMonthlyLabel = '${products[p]} in ${months[m]}';
      }
    }
    print('${months[m]} : \$${monthTotal.toStringAsFixed(2)}');
  }

  print('');
  print('--- Product Yearly Totals ---');
  double best = -1;
  double worst = double.infinity;
  String bestProduct = '';
  String worstProduct = '';

  for (int p = 0; p < products.length; p++) {
    double yearTotal = 0;
    for (int m = 0; m < months.length; m++) {
      yearTotal += sales[p][m];
    }
    print('${products[p].padRight(7)} : \$${yearTotal.toStringAsFixed(2)}');
    if (yearTotal > best) {
      best = yearTotal;
      bestProduct = products[p];
    }
    if (yearTotal < worst) {
      worst = yearTotal;
      worstProduct = products[p];
    }
  }

  print('');
  print('Best-selling  : $bestProduct (\$${best.toStringAsFixed(2)})');
  print('Worst-selling : $worstProduct (\$${worst.toStringAsFixed(2)})');
  print('Highest Sale  : \$${highestMonthlySale.toStringAsFixed(2)} - $highestMonthlyLabel');
}
'''

FILES["ex16.dart"] = r'''
// Exercise 16 - Hotel Room System (6 floors x 20 rooms, seeded random occupancy)
import 'dart:math';

// ---------- INPUT ----------
const int floors = 6;
const int roomsPerFloor = 20;
const int seed = 7;

void main() {
  final random = Random(seed);
  int occupied = 0;
  int empty = 0;

  for (int floor = 1; floor <= floors; floor++) {
    for (int room = 1; room <= roomsPerFloor; room++) {
      final int number = floor * 100 + room;
      final bool isOccupied = random.nextBool();
      if (isOccupied) {
        occupied++;
      } else {
        empty++;
      }
      print('$number ${isOccupied ? 'Occupied' : 'Available'}');
    }
  }

  final int totalRooms = floors * roomsPerFloor;
  print('');
  print('Occupied Rooms : $occupied');
  print('Empty Rooms    : $empty');
  print('Occupancy Rate : ${(occupied / totalRooms * 100).toStringAsFixed(2)}%');
}
'''

FILES["ex17.dart"] = r'''
// Exercise 17 - Pascal Triangle (height from input)

// ---------- INPUT ----------
const int height = 6;

void main() {
  final List<List<int>> rows = [];

  for (int i = 0; i < height; i++) {
    final List<int> row = [];
    for (int j = 0; j <= i; j++) {
      if (j == 0 || j == i) {
        row.add(1);
      } else {
        row.add(rows[i - 1][j - 1] + rows[i - 1][j]);
      }
    }
    rows.add(row);
  }

  for (int i = 0; i < height; i++) {
    String line = ' ' * ((height - i - 1) * 2);
    for (int j = 0; j < rows[i].length; j++) {
      line += rows[i][j].toString().padRight(4);
    }
    print(line.trimRight());
  }
}
'''

FILES["ex18.dart"] = r'''
// Exercise 18 - Diamond Pattern (nested loops only)

// ---------- INPUT ----------
const int n = 5;

void main() {
  // Upper half including the middle row.
  for (int i = 1; i <= n; i++) {
    String line = '';
    for (int s = 1; s <= n - i; s++) {
      line += ' ';
    }
    for (int star = 1; star <= 2 * i - 1; star++) {
      line += '*';
    }
    print(line);
  }

  // Lower half.
  for (int i = n - 1; i >= 1; i--) {
    String line = '';
    for (int s = 1; s <= n - i; s++) {
      line += ' ';
    }
    for (int star = 1; star <= 2 * i - 1; star++) {
      line += '*';
    }
    print(line);
  }
}
'''

FILES["ex19.dart"] = r'''
// Exercise 19 - Inventory Report (4 warehouses x 8 products)

// ---------- INPUT ----------
const List<String> warehouses = ['WH-A', 'WH-B', 'WH-C', 'WH-D'];
const List<String> products = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];
const List<List<int>> quantity = [
  [12, 40, 25, 8, 60, 33, 19, 45],
  [22, 15, 30, 12, 48, 27, 24, 39],
  [5, 60, 18, 20, 55, 41, 30, 50],
  [18, 28, 22, 14, 38, 29, 21, 42],
];

void main() {
  int grandTotal = 0;
  int highestWarehouseTotal = -1;
  String richestWarehouse = '';

  print('--- Warehouse Totals ---');
  for (int w = 0; w < warehouses.length; w++) {
    int total = 0;
    for (int p = 0; p < products.length; p++) {
      total += quantity[w][p];
    }
    grandTotal += total;
    print('${warehouses[w]} : $total');
    if (total > highestWarehouseTotal) {
      highestWarehouseTotal = total;
      richestWarehouse = warehouses[w];
    }
  }

  print('');
  print('--- Product Totals ---');
  int lowestProductTotal = 1 << 30;
  String lowestProduct = '';
  for (int p = 0; p < products.length; p++) {
    int total = 0;
    for (int w = 0; w < warehouses.length; w++) {
      total += quantity[w][p];
    }
    print('${products[p]} : $total');
    if (total < lowestProductTotal) {
      lowestProductTotal = total;
      lowestProduct = products[p];
    }
  }

  print('');
  print('Grand Total        : $grandTotal');
  print('Highest Inventory  : $richestWarehouse ($highestWarehouseTotal)');
  print('Lowest Stock       : $lowestProduct ($lowestProductTotal)');
}
'''

FILES["ex20.dart"] = r'''
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
'''

for name, body in FILES.items():
    (OUT / name).write_text(body.lstrip("\n"))
print("wrote", len(FILES), "files")
