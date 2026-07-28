// Exercise 30 - Digit analysis of a positive integer using while

// ---------- INPUT ----------
const int number = 752125;

void main() {
  int n = number;
  int count = 0;
  int sum = 0;
  int evens = 0;
  int odds = 0;
  int largest = 0;
  int smallest = 9;

  while (n > 0) {
    final int digit = n % 10;
    count++;
    sum += digit;
    if (digit % 2 == 0) {
      evens++;
    } else {
      odds++;
    }
    if (digit > largest) largest = digit;
    if (digit < smallest) smallest = digit;
    n = n ~/ 10;
  }

  print('Input number: $number');
  print('Count digit : $count');
  print('Sum         : $sum');
  print('Count even  : $evens');
  print('Count odd   : $odds');
  print('Largest     : $largest');
  print('Smallest    : $smallest');
}
