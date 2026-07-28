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
