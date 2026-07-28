// Exercise 46 - Electricity Bill (named parameters with default rate)

// ---------- INPUT ----------
const double units = 320;
const double customRate = 0.31;

double bill({
  required double units,
  double rate = 0.25,
}) =>
    units * rate;

void main() {
  print('Units        : ${units.toStringAsFixed(0)}');
  print('Default rate : \$${bill(units: units).toStringAsFixed(2)}');
  print('Custom rate  : \$${bill(units: units, rate: customRate).toStringAsFixed(2)}');
}
