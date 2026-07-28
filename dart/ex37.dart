// Exercise 37 - Multiplication Table Analyzer
// Outer loop = while, inner loop = do...while.

// ---------- INPUT ----------
const int from = 2;
const int to = 12;
const int upTo = 12;

void main() {
  int table = from;
  int overallSum = 0;
  int overallCount = 0;
  int overallLargest = 0;
  int overallSmallest = 1 << 30;

  while (table <= to) {
    int i = 1;
    int sum = 0;
    int largest = 0;
    int smallest = 1 << 30;

    do {
      final int product = table * i;
      sum += product;
      if (product > largest) largest = product;
      if (product < smallest) smallest = product;
      i++;
    } while (i <= upTo);

    overallSum += sum;
    overallCount += upTo;
    if (largest > overallLargest) overallLargest = largest;
    if (smallest < overallSmallest) overallSmallest = smallest;

    print('Table ${table.toString().padLeft(2)} -> sum: ${sum.toString().padLeft(4)}  '
        'avg: ${(sum / upTo).toStringAsFixed(2).padLeft(6)}  '
        'largest: ${largest.toString().padLeft(3)}  smallest: ${smallest.toString().padLeft(2)}');
    table++;
  }

  print('');
  print('Overall Sum      : $overallSum');
  print('Overall Average  : ${(overallSum / overallCount).toStringAsFixed(2)}');
  print('Largest Product  : $overallLargest');
  print('Smallest Product : $overallSmallest');
}
