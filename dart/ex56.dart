// Exercise 56 - University Student Report System
// report() calls average(), grade() and isPass().

// ---------- INPUT ----------
const String studentName = 'Sok Dara';
const List<int> studentScores = [82, 76, 91, 68, 88]; // Khmer, English, Math, ICT, Science
const List<String> subjects = ['Khmer', 'English', 'Math', 'ICT', 'Science'];

double average(List<int> scores) =>
    scores.fold<int>(0, (sum, score) => sum + score) / scores.length;

String grade(double average) {
  if (average >= 90) return 'A';
  if (average >= 80) return 'B';
  if (average >= 70) return 'C';
  if (average >= 60) return 'D';
  return 'F';
}

bool isPass(double average) => average >= 60;

void report({
  required String name,
  required List<int> scores,
}) {
  final double avg = average(scores);

  print('Student Name : $name');
  print('Scores:');
  for (int i = 0; i < scores.length; i++) {
    print('${subjects[i].padRight(7)}: ${scores[i]}');
  }
  print('');
  print('Average : ${avg.toStringAsFixed(2)}');
  print('Grade   : ${grade(avg)}');
  print('Status  : ${isPass(avg) ? 'Pass' : 'Fail'}');
}

void main() {
  report(name: studentName, scores: studentScores);
}
