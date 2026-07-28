// Exercise 49 - Normal functions rewritten as arrow functions

// ---------- INPUT ----------
const int a = 12;
const int b = 30;

int square(int n) => n * n;

int multiply(int x, int y) => x * y;

int maximum(int x, int y) => x > y ? x : y;

int minimum(int x, int y) => x < y ? x : y;

void main() {
  print('square($a)        = ${square(a)}');
  print('multiply($a, $b) = ${multiply(a, b)}');
  print('maximum($a, $b)  = ${maximum(a, b)}');
  print('minimum($a, $b)  = ${minimum(a, b)}');
}
