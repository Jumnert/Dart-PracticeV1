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
