// Exercise 35 - Student Grade Processing (do...while only, stops at -1)

// ---------- INPUT ----------
const List<int> scores = [95, 82, 71, 64, 55, 88, 91, 45, -1];

void main() {
  int count = 0;
  int highest = -1;
  int lowest = 101;
  int total = 0;
  int a = 0, b = 0, c = 0, d = 0, f = 0;
  int index = 0;
  int score;

  do {
    score = scores[index];
    index++;
    print('Enter score (-1 to stop): $score');
    if (score == -1) break;

    count++;
    total += score;
    if (score > highest) highest = score;
    if (score < lowest) lowest = score;

    if (score >= 90) {
      a++;
    } else if (score >= 80) {
      b++;
    } else if (score >= 70) {
      c++;
    } else if (score >= 60) {
      d++;
    } else {
      f++;
    }
  } while (index < scores.length);

  print('');
  print('Number of students : $count');
  print('Highest score      : $highest');
  print('Lowest score       : $lowest');
  print('Average score      : ${(total / count).toStringAsFixed(2)}');
  print('A (90-100)         : $a');
  print('B (80-89)          : $b');
  print('C (70-79)          : $c');
  print('D (60-69)          : $d');
  print('F (<60)            : $f');
  print('Pass Rate          : ${((count - f) / count * 100).toStringAsFixed(2)}%');
  print('Fail Rate          : ${(f / count * 100).toStringAsFixed(2)}%');
}
