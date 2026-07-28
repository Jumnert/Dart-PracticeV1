// Exercise 28 - Pattern: hollow rectangle of stars.

// ---------- INPUT ----------
const int rows = 10;
const int cols = 11;

void main() {
  for (int row = 1; row <= rows; row++) {
    String line = '';
    for (int col = 1; col <= cols; col++) {
      final bool onBorder =
          row == 1 || row == rows || col == 1 || col == cols;
      line += onBorder ? '*' : ' ';
    }
    print(line);
  }
}
