// Exercise 34 - Perfect Number Analyzer (nested while, stops at -1)

// ---------- INPUT ----------
const List<int> inputs = [6, 28, 15, 496, -1];

void main() {
  int perfectCount = 0;
  int nonPerfectCount = 0;
  int largestPerfect = -1;
  int smallestPerfect = -1;
  int i = 0;

  while (i < inputs.length) {
    final int number = inputs[i];
    i++;
    print('Enter number (-1 to stop): $number');
    if (number == -1) break;

    // Inner while sums the proper divisors.
    int divisor = 1;
    int sum = 0;
    while (divisor <= number ~/ 2) {
      if (number % divisor == 0) sum += divisor;
      divisor++;
    }

    final bool isPerfect = sum == number && number > 0;
    if (isPerfect) {
      perfectCount++;
      if (largestPerfect == -1 || number > largestPerfect) largestPerfect = number;
      if (smallestPerfect == -1 || number < smallestPerfect) smallestPerfect = number;
      print('  $number is a Perfect Number');
    } else {
      nonPerfectCount++;
      print('  $number is Not Perfect (divisor sum = $sum)');
    }
  }

  print('');
  print('Perfect Numbers : $perfectCount');
  print('Non Perfect     : $nonPerfectCount');
  print('Largest Perfect : $largestPerfect');
  print('Smallest Perfect: $smallestPerfect');
}
