// Exercise 5 - Smart Traffic Fine System
// switch statement chooses the speed limit, if-else grades the penalty.

// ---------- INPUT ----------
const String vehicleType = 'Car';
const int speed = 115;
const bool schoolZone = true;

void main() {
  int limit;
  switch (vehicleType) {
    case 'Motorcycle':
      limit = 60;
      break;
    case 'Car':
      limit = 80;
      break;
    case 'Truck':
      limit = 70;
      break;
    default:
      limit = 0;
  }

  final int over = speed - limit;
  print('Vehicle Type : $vehicleType');
  print('Speed Limit  : $limit km/h');
  print('Actual Speed : $speed km/h');

  if (over <= 0) {
    print('Result       : No violation');
    return;
  }

  double fine;
  if (over <= 20) {
    fine = 50;
  } else if (over <= 40) {
    fine = 150;
  } else {
    fine = 500;
  }

  print('Over Limit   : $over km/h');
  print('Base Fine    : \$${fine.toStringAsFixed(2)}');

  if (schoolZone) {
    fine *= 2;
    print('School Zone  : Fine doubled');
  }

  print('Total Fine   : \$${fine.toStringAsFixed(2)}');
}
