// Exercise 31 - Digital root: keep adding digits until one digit remains

// ---------- INPUT ----------
const int number = 789456;

void main() {
  int current = number;
  print('Input positive number:$number');

  while (current >= 10) {
    print('Current number: $current');
    int sum = 0;
    int n = current;
    while (n > 0) {
      sum += n % 10;
      n = n ~/ 10;
    }
    print('Sum digits: $sum');
    current = sum;
  }

  print('Final sum digit: $current');
}
