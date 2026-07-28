// Exercise 48 - Bank Interest (positional + named parameters)

// ---------- INPUT ----------
const double amount = 5000;
const double customRate = 7.5;
const int customYears = 3;

double interest(
  double amount, {
  double rate = 5,
  int years = 1,
}) =>
    amount * rate * years / 100;

void main() {
  print('Amount            : \$${amount.toStringAsFixed(2)}');
  print('Default (5%, 1y)  : \$${interest(amount).toStringAsFixed(2)}');
  print('Custom (7.5%, 3y) : \$${interest(amount, rate: customRate, years: customYears).toStringAsFixed(2)}');
}
