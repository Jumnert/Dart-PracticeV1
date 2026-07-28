// Exercise 21 - Matrix Analysis (6 x 6)

// ---------- INPUT ----------
const List<List<int>> a = [
  [4, 12, 7, 19, 2, 8],
  [15, 3, 11, 6, 20, 9],
  [1, 18, 5, 14, 10, 13],
  [22, 7, 16, 2, 9, 4],
  [8, 25, 3, 17, 6, 11],
  [12, 5, 21, 10, 14, 7],
];
const int n = 6;

void main() {
  print('--- Row Sums ---');
  for (int i = 0; i < n; i++) {
    int sum = 0;
    for (int j = 0; j < n; j++) {
      sum += a[i][j];
    }
    print('Row ${i + 1} : $sum');
  }

  print('');
  print('--- Column Sums ---');
  for (int j = 0; j < n; j++) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
      sum += a[i][j];
    }
    print('Col ${j + 1} : $sum');
  }

  int mainDiagonal = 0;
  int secondaryDiagonal = 0;
  int largest = a[0][0];
  int smallest = a[0][0];
  int evens = 0;
  int odds = 0;

  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      final int value = a[i][j];
      if (i == j) mainDiagonal += value;
      if (i + j == n - 1) secondaryDiagonal += value;
      if (value > largest) largest = value;
      if (value < smallest) smallest = value;
      if (value % 2 == 0) {
        evens++;
      } else {
        odds++;
      }
    }
  }

  print('');
  print('Main Diagonal Sum      : $mainDiagonal');
  print('Secondary Diagonal Sum : $secondaryDiagonal');
  print('Largest Value          : $largest');
  print('Smallest Value         : $smallest');
  print('Even Numbers           : $evens');
  print('Odd Numbers            : $odds');
}
