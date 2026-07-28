// Exercise 9 - Smart Restaurant Ordering System
// switch expression for meal, nested ternary for drink, switch expression for membership.

// ---------- INPUT ----------
const String mealType = 'Steak';
const String drinkSize = 'Large';
const String membership = 'Gold';

void main() {
  final double mealCost = switch (mealType) {
    'Burger' => 6.50,
    'Pizza' => 9.00,
    'Steak' => 15.00,
    'Pasta' => 8.00,
    _ => 0,
  };

  final double drinkCost = drinkSize == 'Small'
      ? 1.50
      : drinkSize == 'Medium'
          ? 2.50
          : drinkSize == 'Large'
              ? 3.50
              : 0.0;

  final double discountRate = switch (membership) {
    'Silver' => 0.05,
    'Gold' => 0.10,
    'VIP' => 0.20,
    _ => 0.00,
  };

  final double subtotal = mealCost + drinkCost;
  final double discount = subtotal * discountRate;

  print('Meal          : $mealType');
  print('Meal Cost     : \$${mealCost.toStringAsFixed(2)}');
  print('Drink         : $drinkSize');
  print('Drink Cost    : \$${drinkCost.toStringAsFixed(2)}');
  print('Membership    : $membership');
  print('Discount      : \$${discount.toStringAsFixed(2)} (${(discountRate * 100).toStringAsFixed(0)}%)');
  print('Total Payment : \$${(subtotal - discount).toStringAsFixed(2)}');
}
