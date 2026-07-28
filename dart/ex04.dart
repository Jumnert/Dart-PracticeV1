// Exercise 4 - Online Shopping Checkout
// switch expression for tier discount + coupon / cashback / gift rules.

// ---------- INPUT ----------
const String customerType = 'Gold';
const double purchaseAmount = 1200;
const String couponCode = 'SAVE50';
const String paymentMethod = 'Credit Card';

void main() {
  final double discountRate = switch (customerType) {
    'Regular' => 0.00,
    'Silver' => 0.05,
    'Gold' => 0.10,
    'Platinum' => 0.15,
    _ => 0.00,
  };

  final double discount = purchaseAmount * discountRate;
  double afterDiscount = purchaseAmount - discount;

  double coupon = 0;
  if (couponCode == 'SAVE50') {
    coupon = 50;
  } else if (couponCode == 'SAVE10') {
    coupon = afterDiscount * 0.10;
  }
  final double finalPayment = afterDiscount - coupon;

  double cashback = 0;
  if (paymentMethod == 'Credit Card') {
    cashback = finalPayment * 0.02;
  }

  print('Customer Type  : $customerType');
  print('Purchase       : \$${purchaseAmount.toStringAsFixed(2)}');
  print('Discount       : \$${discount.toStringAsFixed(2)} (${(discountRate * 100).toStringAsFixed(0)}%)');
  print('Coupon Value   : \$${coupon.toStringAsFixed(2)}');
  print('Final Payment  : \$${finalPayment.toStringAsFixed(2)}');
  print('Cashback       : \$${cashback.toStringAsFixed(2)}');
  print('Free Gift      : ${purchaseAmount > 1000 ? 'Yes' : 'No'}');
}
