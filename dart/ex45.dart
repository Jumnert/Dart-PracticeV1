// Exercise 45 - Circle Calculator
import 'dart:math' as math;

// ---------- INPUT ----------
const double radius = 7.5;

double area(double radius) => math.pi * radius * radius;

double circumference(double radius) => 2 * math.pi * radius;

void main() {
  print('Radius        : $radius');
  print('Area          : ${area(radius).toStringAsFixed(2)}');
  print('Circumference : ${circumference(radius).toStringAsFixed(2)}');
}
