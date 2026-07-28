// Exercise 14 - Multiplication tables from 2 to 20 (nested for loops).

// ---------- INPUT ----------
const int from = 2;
const int to = 20;
const int upTo = 12;

void main() {
  for (int table = from; table <= to; table++) {
    print('--- Table of $table ---');
    for (int i = 1; i <= upTo; i++) {
      print('${table.toString().padLeft(2)} x ${i.toString().padLeft(2)} = ${(table * i).toString().padLeft(3)}');
    }
    print('');
  }
}
