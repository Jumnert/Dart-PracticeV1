// Exercise 40 - Sum Until Zero

// ---------- INPUT ----------
const List<int> inputs = [10, 20, 30, 0];

void main() {
  int count = 0;
  int sum = 0;
  int i = 0;

  while (i < inputs.length) {
    final int value = inputs[i];
    i++;
    print('Enter integer (0 to stop): $value');
    if (value == 0) break;
    count++;
    sum += value;
  }

  print('');
  print('Total Numbers : $count');
  print('Sum : $sum');
  print('Average : ${count == 0 ? 0 : sum / count}');
}
