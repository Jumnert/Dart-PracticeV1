import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "dart"
OUT.mkdir(exist_ok=True)
FILES = {}

FILES["ex41.dart"] = r'''
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
'''

FILES["ex42.dart"] = r'''
// Exercise 42 - Student Grade (arrow function)

// ---------- INPUT ----------
const List<int> scores = [95, 83, 74, 61, 42];

String grade(int score) => score >= 90
    ? 'A'
    : score >= 80
        ? 'B'
        : score >= 70
            ? 'C'
            : score >= 60
                ? 'D'
                : 'F';

void main() {
  for (final score in scores) {
    print('Score ${score.toString().padLeft(3)} -> Grade ${grade(score)}');
  }
}
'''

FILES["ex43.dart"] = r'''
// Exercise 43 - Employee Salary (named parameters)

// ---------- INPUT ----------
const double basic = 1200;
const double bonusAmount = 250;
const double taxAmount = 90;

double calculateSalary({
  required double basicSalary,
  double bonus = 0,
  double tax = 0,
}) =>
    basicSalary + bonus - tax;

void main() {
  final double net = calculateSalary(
    basicSalary: basic,
    bonus: bonusAmount,
    tax: taxAmount,
  );

  print('Basic Salary : \$${basic.toStringAsFixed(2)}');
  print('Bonus        : \$${bonusAmount.toStringAsFixed(2)}');
  print('Tax          : \$${taxAmount.toStringAsFixed(2)}');
  print('Net Salary   : \$${net.toStringAsFixed(2)}');
  print('No bonus/tax : \$${calculateSalary(basicSalary: basic).toStringAsFixed(2)}');
}
'''

FILES["ex44.dart"] = r'''
// Exercise 44 - Shopping Discount (optional positional parameter)

// ---------- INPUT ----------
const double price = 19.99;
const int quantity = 4;
const double discount = 15;

double totalPrice(double price, int quantity, [double discount = 0]) =>
    (price * quantity) - discount;

void main() {
  print('Price        : \$${price.toStringAsFixed(2)}');
  print('Quantity     : $quantity');
  print('Discount     : \$${discount.toStringAsFixed(2)}');
  print('Final Payment: \$${totalPrice(price, quantity, discount).toStringAsFixed(2)}');
  print('Without discount: \$${totalPrice(price, quantity).toStringAsFixed(2)}');
}
'''

FILES["ex45.dart"] = r'''
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
'''

FILES["ex46.dart"] = r'''
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
'''

FILES["ex47.dart"] = r'''
// Exercise 47 - Login Validation

// ---------- INPUT ----------
const List<List<String>> attempts = [
  ['admin', '1234'],
  ['admin', '0000'],
  ['user', '1234'],
];

bool login(String username, String password) =>
    username == 'admin' && password == '1234';

void main() {
  for (final attempt in attempts) {
    final bool ok = login(attempt[0], attempt[1]);
    print('${attempt[0]} / ${attempt[1]} -> ${ok ? 'Login Success' : 'Login Failed'}');
  }
}
'''

FILES["ex48.dart"] = r'''
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
'''

FILES["ex49.dart"] = r'''
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
'''

FILES["ex50.dart"] = r'''
// Exercise 50 - Product Information (named parameters, required + defaults)

void product({
  required String name,
  required double price,
  int quantity = 1,
  bool inStock = true,
}) {
  print('Product  : $name');
  print('Price    : \$${price.toStringAsFixed(2)}');
  print('Quantity : $quantity');
  print('In Stock : ${inStock ? 'Yes' : 'No'}');
  print('Total    : \$${(price * quantity).toStringAsFixed(2)}');
  print('');
}

void main() {
  product(name: 'Mechanical Keyboard', price: 89.90, quantity: 2);
  product(name: 'USB-C Hub', price: 34.50, inStock: false);
}
'''

for name, body in FILES.items():
    (OUT / name).write_text(body.lstrip("\n"))
print("wrote", len(FILES), "files")
