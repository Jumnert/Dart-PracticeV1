// Exercise 1 - Smart Employee Bonus System
// switch expression for base bonus + nested if-else for performance uplift.

// ---------- INPUT ----------
const String level = 'Senior';
const int yearsOfService = 6;
const int performanceScore = 93;

void main() {
  final double baseBonus = switch (level) {
    'Junior' => 500,
    'Mid' => 1000,
    'Senior' => 2000,
    _ => 0,
  };

  print('Employee Level    : $level');
  print('Years of Service  : $yearsOfService');
  print('Performance Score : $performanceScore');
  print('Base Bonus        : \$${baseBonus.toStringAsFixed(2)}');

  if (performanceScore < 60) {
    print('Result            : Performance Improvement Required');
    return;
  }

  double rate;
  if (performanceScore >= 90) {
    if (yearsOfService >= 5) {
      rate = 0.50;
    } else {
      rate = 0.30;
    }
  } else if (performanceScore >= 75) {
    rate = 0.15;
  } else {
    rate = 0.0;
  }

  final double increase = baseBonus * rate;
  final double annualBonus = baseBonus + increase;

  print('Increase Rate     : ${(rate * 100).toStringAsFixed(0)}%');
  print('Increase Amount   : \$${increase.toStringAsFixed(2)}');
  print('Annual Bonus      : \$${annualBonus.toStringAsFixed(2)}');
}
