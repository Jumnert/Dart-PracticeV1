// Exercise 36 - Reverse Digit analysis (while only, no String conversion)

// ---------- INPUT ----------
const int number = 12321;

void main() {
  int n = number;
  int reverse = 0;
  int largest = 0;
  int smallest = 9;
  int count = 0;
  int sum = 0;
  int product = 1;

  while (n > 0) {
    final int digit = n % 10;
    reverse = reverse * 10 + digit;
    if (digit > largest) largest = digit;
    if (digit < smallest) smallest = digit;
    count++;
    sum += digit;
    product *= digit;
    n = n ~/ 10;
  }

  print('Original Number : $number');
  print('Reverse Number  : $reverse');
  print('Largest Digit   : $largest');
  print('Smallest Digit  : $smallest');
  print('Digit Count     : $count');
  print('Sum of Digits   : $sum');
  print('Product of Digits: $product');
  print('Palindrome      : ${reverse == number ? 'Yes' : 'No'}');
}
