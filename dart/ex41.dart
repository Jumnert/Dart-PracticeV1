// Exercise 41 - Rectangle Calculator (positional parameters)

// ---------- INPUT ----------
const double length = 12.5;
const double width = 4;

double area(double length, double width) => length * width;

double perimeter(double length, double width) => 2 * (length + width);

void main() {
  print('Length    : $length');
  print('Width     : $width');
  print('Area      : ${area(length, width).toStringAsFixed(2)}');
  print('Perimeter : ${perimeter(length, width).toStringAsFixed(2)}');
}
