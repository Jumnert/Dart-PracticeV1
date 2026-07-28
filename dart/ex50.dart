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
