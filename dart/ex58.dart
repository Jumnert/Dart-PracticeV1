// Exercise 58 - Online Shopping System
// totalPayment() calls subtotal(), discount() and shipping() - no duplicated math.

// ---------- INPUT ----------
const List<double> cart = [249.99, 320.50, 89.90, 410.00];
const bool useExpress = true;

double subtotal(List<double> prices) =>
    prices.fold<double>(0, (sum, price) => sum + price);

double discount(double subtotal) {
  if (subtotal >= 1000) return subtotal * 0.15;
  if (subtotal >= 500) return subtotal * 0.10;
  if (subtotal >= 200) return subtotal * 0.05;
  return 0;
}

double shipping({
  required double subtotal,
  bool express = false,
}) =>
    subtotal >= 1500 ? 0 : (express ? 25 : 10);

double totalPayment({
  required List<double> prices,
  bool express = false,
}) {
  final double sub = subtotal(prices);
  final double off = discount(sub);
  final double ship = shipping(subtotal: sub, express: express);

  print('Subtotal      : \$${sub.toStringAsFixed(2)}');
  print('Discount      : \$${off.toStringAsFixed(2)}');
  print('Shipping      : \$${ship.toStringAsFixed(2)}');

  return sub - off + ship;
}

void main() {
  final double total = totalPayment(prices: cart, express: useExpress);
  print('Total Payment : \$${total.toStringAsFixed(2)}');
}
