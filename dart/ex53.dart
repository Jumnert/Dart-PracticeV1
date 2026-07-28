// Exercise 53 - Calculator using lambda functions stored in variables

// ---------- INPUT ----------
const double x = 36;
const double y = 8;

void main() {
  final double Function(double, double) add = (a, b) => a + b;
  final double Function(double, double) subtract = (a, b) => a - b;
  final double Function(double, double) multiply = (a, b) => a * b;
  final double Function(double, double) divide = (a, b) => b == 0 ? 0 : a / b;

  print('$x + $y = ${add(x, y)}');
  print('$x - $y = ${subtract(x, y)}');
  print('$x * $y = ${multiply(x, y)}');
  print('$x / $y = ${divide(x, y)}');
}
