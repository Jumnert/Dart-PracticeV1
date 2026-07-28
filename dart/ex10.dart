// Exercise 10 - Vehicle Insurance Premium Calculator
// switch expression for base premium, then stacked percentage adjustments.

// ---------- INPUT ----------
const String vehicleType = 'Car';
const int driverAge = 23;
const int drivingExperience = 1;
const int accidents = 1;
const int annualMileage = 22000;

void main() {
  final double basePremium = switch (vehicleType) {
    'Car' => 800,
    'Motorcycle' => 500,
    'Truck' => 1200,
    _ => 0,
  };

  print('Vehicle Type     : $vehicleType');
  print('Base Premium     : \$${basePremium.toStringAsFixed(2)}');

  if (accidents > 2) {
    print('Insurance Status : Application Rejected (more than 2 accidents)');
    return;
  }

  double adjustment = 0;

  if (driverAge < 25) {
    adjustment += 0.25;
  } else if (driverAge >= 60) {
    adjustment += 0.15;
  }

  if (drivingExperience < 2) {
    adjustment += 0.10;
  }

  if (accidents == 1) {
    adjustment += 0.15;
  } else if (accidents == 2) {
    adjustment += 0.35;
  }

  if (annualMileage < 10000) {
    adjustment -= 0.05;
  } else if (annualMileage > 20000) {
    adjustment += 0.10;
  }

  final double finalPremium = basePremium * (1 + adjustment);

  print('Total Adjustment : ${(adjustment * 100).toStringAsFixed(0)}%');
  print('Final Premium    : \$${finalPremium.toStringAsFixed(2)}');
  print('Insurance Status : Approved');
}
