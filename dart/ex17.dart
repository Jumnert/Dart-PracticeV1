// Exercise 17 - Pascal Triangle (height from input)

// ---------- INPUT ----------
const int height = 6;

void main() {
  final List<List<int>> rows = [];

  for (int i = 0; i < height; i++) {
    final List<int> row = [];
    for (int j = 0; j <= i; j++) {
      if (j == 0 || j == i) {
        row.add(1);
      } else {
        row.add(rows[i - 1][j - 1] + rows[i - 1][j]);
      }
    }
    rows.add(row);
  }

  for (int i = 0; i < height; i++) {
    String line = ' ' * ((height - i - 1) * 2);
    for (int j = 0; j < rows[i].length; j++) {
      line += rows[i][j].toString().padRight(4);
    }
    print(line.trimRight());
  }
}
