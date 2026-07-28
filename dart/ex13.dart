// Exercise 13 - Star pattern: left edge + diagonal + full bottom row.

// ---------- INPUT ----------
const int n = 7;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      if (row == n) {
        line += '*';
      } else if (col == 1 || col == row) {
        line += '*';
      } else if (col < row) {
        line += ' ';
      }
    }
    print(line);
  }
}
