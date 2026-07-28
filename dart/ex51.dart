// Exercise 51 - Function Composition: finalPrice() calls tax() and discount()

// ---------- INPUT ----------
const double amount = 800;

double tax(double amount) => amount * 0.10;

double discount(double amount) => amount >= 500 ? amount * 0.15 : 0;

double finalPrice(double amount) => amount + tax(amount) - discount(amount);

void main() {
  print('Amount      : \$${amount.toStringAsFixed(2)}');
  print('Tax (10%)   : \$${tax(amount).toStringAsFixed(2)}');
  print('Discount    : \$${discount(amount).toStringAsFixed(2)}');
  print('Final Price : \$${finalPrice(amount).toStringAsFixed(2)}');
}
