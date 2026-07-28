// Exercise 27 - Pattern: '+' diagonal, '-' below it, '=' above it.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      if (row == col) {
        line += '+ ';
      } else if (col < row) {
        line += '- ';
      } else {
        line += '= ';
      }
    }
    print(line.trimRight());
  }
}
