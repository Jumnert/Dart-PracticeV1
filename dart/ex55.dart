// Exercise 55 - Anonymous functions with a collection (no for loop)

// ---------- INPUT ----------
const List<int> numbers = [5, 12, 8, 20, 15];

void main() {
  print('--- forEach ---');
  numbers.forEach((n) => print(n));

  print('--- where (even) ---');
  numbers.where((n) => n % 2 == 0).forEach((n) => print(n));

  print('--- map (x10) ---');
  numbers.map((n) => n * 10).forEach((n) => print(n));
}
