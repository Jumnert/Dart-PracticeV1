// Exercise 23 - Pattern: '+' on the main diagonal, '=' everywhere else.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      line += (row == col) ? '+ ' : '= ';
    }
    print(line.trimRight());
  }
}
