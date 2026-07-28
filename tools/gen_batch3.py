import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "dart"
OUT.mkdir(exist_ok=True)
FILES = {}

FILES["ex21.dart"] = r'''
// Exercise 21 - Matrix Analysis (6 x 6)

// ---------- INPUT ----------
const List<List<int>> a = [
  [4, 12, 7, 19, 2, 8],
  [15, 3, 11, 6, 20, 9],
  [1, 18, 5, 14, 10, 13],
  [22, 7, 16, 2, 9, 4],
  [8, 25, 3, 17, 6, 11],
  [12, 5, 21, 10, 14, 7],
];
const int n = 6;

void main() {
  print('--- Row Sums ---');
  for (int i = 0; i < n; i++) {
    int sum = 0;
    for (int j = 0; j < n; j++) {
      sum += a[i][j];
    }
    print('Row ${i + 1} : $sum');
  }

  print('');
  print('--- Column Sums ---');
  for (int j = 0; j < n; j++) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
      sum += a[i][j];
    }
    print('Col ${j + 1} : $sum');
  }

  int mainDiagonal = 0;
  int secondaryDiagonal = 0;
  int largest = a[0][0];
  int smallest = a[0][0];
  int evens = 0;
  int odds = 0;

  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      final int value = a[i][j];
      if (i == j) mainDiagonal += value;
      if (i + j == n - 1) secondaryDiagonal += value;
      if (value > largest) largest = value;
      if (value < smallest) smallest = value;
      if (value % 2 == 0) {
        evens++;
      } else {
        odds++;
      }
    }
  }

  print('');
  print('Main Diagonal Sum      : $mainDiagonal');
  print('Secondary Diagonal Sum : $secondaryDiagonal');
  print('Largest Value          : $largest');
  print('Smallest Value         : $smallest');
  print('Even Numbers           : $evens');
  print('Odd Numbers            : $odds');
}
'''

FILES["ex22.dart"] = r'''
// Exercise 22 - School Attendance System (30 students x 20 days)
import 'dart:math';

// ---------- INPUT ----------
const int studentCount = 30;
const int schoolDays = 20;
const int seed = 2024;

void main() {
  final random = Random(seed);

  // Build the attendance sheet: P = Present, A = Absent, L = Late.
  final List<List<String>> sheet = [];
  for (int s = 0; s < studentCount; s++) {
    final List<String> row = [];
    for (int d = 0; d < schoolDays; d++) {
      final int roll = random.nextInt(10);
      row.add(roll < 7 ? 'P' : (roll < 9 ? 'L' : 'A'));
    }
    sheet.add(row);
  }

  int totalPresent = 0;
  int totalAbsent = 0;
  int totalLate = 0;
  double bestPercent = -1;
  double worstPercent = 101;
  int bestStudent = 0;
  int worstStudent = 0;

  for (int s = 0; s < studentCount; s++) {
    int present = 0;
    int absent = 0;
    int late = 0;

    for (int d = 0; d < schoolDays; d++) {
      switch (sheet[s][d]) {
        case 'P':
          present++;
          break;
        case 'A':
          absent++;
          break;
        default:
          late++;
      }
    }

    final double percent = present / schoolDays * 100;
    totalPresent += present;
    totalAbsent += absent;
    totalLate += late;

    if (percent > bestPercent) {
      bestPercent = percent;
      bestStudent = s + 1;
    }
    if (percent < worstPercent) {
      worstPercent = percent;
      worstStudent = s + 1;
    }

    print('Student ${(s + 1).toString().padLeft(2)} : P=${present.toString().padLeft(2)} '
        'A=${absent.toString().padLeft(2)} L=${late.toString().padLeft(2)} '
        '-> ${percent.toStringAsFixed(1).padLeft(5)}%');
  }

  final int totalRecords = studentCount * schoolDays;
  print('');
  print('Highest Attendance : Student $bestStudent (${bestPercent.toStringAsFixed(1)}%)');
  print('Lowest Attendance  : Student $worstStudent (${worstPercent.toStringAsFixed(1)}%)');
  print('Total Presents     : $totalPresent');
  print('Total Absences     : $totalAbsent');
  print('Total Lates        : $totalLate');
  print('School Attendance  : ${(totalPresent / totalRecords * 100).toStringAsFixed(2)}%');
}
'''

FILES["ex23.dart"] = r'''
// Exercise 23 - Pattern: '+' on the main diagonal, '=' everywhere else.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      line += (row == col) ? '+ ' : '= ';
    }
    print(line.trimRight());
  }
}
'''

FILES["ex24.dart"] = r'''
// Exercise 24 - Pattern: lower triangle filled with '+', '=' above the diagonal.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      line += (col <= row) ? '+ ' : '= ';
    }
    print(line.trimRight());
  }
}
'''

FILES["ex25.dart"] = r'''
// Exercise 25 - Pattern: '+' on the secondary (anti) diagonal.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      line += (row + col == n + 1) ? '+ ' : '= ';
    }
    print(line.trimRight());
  }
}
'''

FILES["ex26.dart"] = r'''
// Exercise 26 - Pattern: 'X' shape, '+' on both diagonals.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      final bool onDiagonal = row == col || row + col == n + 1;
      line += onDiagonal ? '+ ' : '= ';
    }
    print(line.trimRight());
  }
}
'''

FILES["ex27.dart"] = r'''
// Exercise 27 - Pattern: '+' diagonal, '-' below it, '=' above it.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      if (row == col) {
        line += '+ ';
      } else if (col < row) {
        line += '- ';
      } else {
        line += '= ';
      }
    }
    print(line.trimRight());
  }
}
'''

FILES["ex28.dart"] = r'''
// Exercise 28 - Pattern: hollow rectangle of stars.

// ---------- INPUT ----------
const int rows = 10;
const int cols = 11;

void main() {
  for (int row = 1; row <= rows; row++) {
    String line = '';
    for (int col = 1; col <= cols; col++) {
      final bool onBorder =
          row == 1 || row == rows || col == 1 || col == cols;
      line += onBorder ? '*' : ' ';
    }
    print(line);
  }
}
'''

for name, body in FILES.items():
    (OUT / name).write_text(body.lstrip("\n"))
print("wrote", len(FILES), "files")
