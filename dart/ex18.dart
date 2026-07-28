// Exercise 18 - Diamond Pattern (nested loops only)

// ---------- INPUT ----------
const int n = 5;

void main() {
  // Upper half including the middle row.
  for (int i = 1; i <= n; i++) {
    String line = '';
    for (int s = 1; s <= n - i; s++) {
      line += ' ';
    }
    for (int star = 1; star <= 2 * i - 1; star++) {
      line += '*';
    }
    print(line);
  }

  // Lower half.
  for (int i = n - 1; i >= 1; i--) {
    String line = '';
    for (int s = 1; s <= n - i; s++) {
      line += ' ';
    }
    for (int star = 1; star <= 2 * i - 1; star++) {
      line += '*';
    }
    print(line);
  }
}
