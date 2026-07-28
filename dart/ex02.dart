// Exercise 2 - International Shipping Calculator
// switch statement for base rate, then express / heavy / reject rules.

// ---------- INPUT ----------
const String destination = 'Europe';
const double weightKg = 35;
const bool express = true;

void main() {
  double ratePerKg;
  switch (destination) {
    case 'Asia':
      ratePerKg = 8;
      break;
    case 'Europe':
      ratePerKg = 12;
      break;
    case 'America':
      ratePerKg = 15;
      break;
    default:
      ratePerKg = 0;
  }

  print('Destination   : $destination');
  print('Weight        : ${weightKg.toStringAsFixed(1)} kg');
  print('Express       : ${express ? 'Yes' : 'No'}');

  if (weightKg > 100) {
    print('Status        : Shipment Rejected (over 100 kg)');
    return;
  }

  double fee = ratePerKg * weightKg;
  print('Base Cost     : \$${fee.toStringAsFixed(2)}');

  if (express) {
    final surcharge = fee * 0.40;
    fee += surcharge;
    print('Express (+40%): \$${surcharge.toStringAsFixed(2)}');
  }

  if (weightKg > 30) {
    fee += 100;
    print('Heavy Cargo   : \$100.00');
  }

  print('Final Fee     : \$${fee.toStringAsFixed(2)}');
}
