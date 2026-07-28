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
