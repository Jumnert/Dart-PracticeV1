// Exercise 8 - Airline Ticket Pricing
// switch expression for the seat class, if-else for age discount and luggage.

// ---------- INPUT ----------
const String seatClass = 'Business';
const int passengerAge = 8;
const double luggageWeight = 26;

void main() {
  final double basePrice = switch (seatClass) {
    'Economy' => 200,
    'Business' => 500,
    'First' => 1000,
    _ => 0,
  };

  double discountRate;
  String discountLabel;
  if (passengerAge < 12) {
    discountRate = 0.50;
    discountLabel = 'Child (50%)';
  } else if (passengerAge >= 60) {
    discountRate = 0.20;
    discountLabel = 'Senior (20%)';
  } else {
    discountRate = 0.0;
    discountLabel = 'None';
  }

  final double ticketPrice = basePrice * (1 - discountRate);
  final double extraKg = luggageWeight > 20 ? luggageWeight - 20 : 0;
  final double luggageFee = extraKg * 15;

  print('Seat Class    : $seatClass');
  print('Base Price    : \$${basePrice.toStringAsFixed(2)}');
  print('Discount      : $discountLabel');
  print('Ticket Price  : \$${ticketPrice.toStringAsFixed(2)}');
  print('Extra Luggage : ${extraKg.toStringAsFixed(1)} kg');
  print('Luggage Fee   : \$${luggageFee.toStringAsFixed(2)}');
  print('Final Payment : \$${(ticketPrice + luggageFee).toStringAsFixed(2)}');
}
