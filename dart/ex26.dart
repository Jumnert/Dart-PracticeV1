// Exercise 26 - Pattern: 'X' shape, '+' on both diagonals.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      final bool onDiagonal = row == col || row + col == n + 1;
      line += onDiagonal ? '+ ' : '= ';
    }
    print(line.trimRight());
  }
}
