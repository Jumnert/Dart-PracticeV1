// Exercise 42 - Student Grade (arrow function)

// ---------- INPUT ----------
const List<int> scores = [95, 83, 74, 61, 42];

String grade(int score) => score >= 90
    ? 'A'
    : score >= 80
        ? 'B'
        : score >= 70
            ? 'C'
            : score >= 60
                ? 'D'
                : 'F';

void main() {
  for (final score in scores) {
    print('Score ${score.toString().padLeft(3)} -> Grade ${grade(score)}');
  }
}
