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
