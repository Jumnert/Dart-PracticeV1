// Exercise 25 - Pattern: '+' on the secondary (anti) diagonal.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      line += (row + col == n + 1) ? '+ ' : '= ';
    }
    print(line.trimRight());
  }
}
