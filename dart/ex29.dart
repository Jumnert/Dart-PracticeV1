// Exercise 29 - Sum numbers until 0 (int stays int, double keeps decimals)

// ---------- INPUT (simulated keyboard entry) ----------
const List<num> inputs = [1, 2, 3, 4, 5, 0];

void main() {
  num sum = 0;
  int i = 0;

  while (i < inputs.length) {
    final num value = inputs[i];
    print('Input number to sum (0 to exit): $value');
    i++;
    if (value == 0) break;
    sum += value;
  }

  // If every entry was an int the total is printed without ".0".
  if (sum is int || sum == sum.truncate()) {
    print('Sum is: ${sum.truncate()}');
  } else {
    print('Sum is: $sum');
  }
}
