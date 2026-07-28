// Exercise 24 - Pattern: lower triangle filled with '+', '=' above the diagonal.

// ---------- INPUT ----------
const int n = 5;

void main() {
  for (int row = 1; row <= n; row++) {
    String line = '';
    for (int col = 1; col <= n; col++) {
      line += (col <= row) ? '+ ' : '= ';
    }
    print(line.trimRight());
  }
}
