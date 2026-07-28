import os, pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "dart"
OUT.mkdir(exist_ok=True)

FILES = {}

FILES["ex01.dart"] = r'''
// Exercise 1 - Smart Employee Bonus System
// switch expression for base bonus + nested if-else for performance uplift.

// ---------- INPUT ----------
const String level = 'Senior';
const int yearsOfService = 6;
const int performanceScore = 93;

void main() {
  final double baseBonus = switch (level) {
    'Junior' => 500,
    'Mid' => 1000,
    'Senior' => 2000,
    _ => 0,
  };

  print('Employee Level    : $level');
  print('Years of Service  : $yearsOfService');
  print('Performance Score : $performanceScore');
  print('Base Bonus        : \$${baseBonus.toStringAsFixed(2)}');

  if (performanceScore < 60) {
    print('Result            : Performance Improvement Required');
    return;
  }

  double rate;
  if (performanceScore >= 90) {
    if (yearsOfService >= 5) {
      rate = 0.50;
    } else {
      rate = 0.30;
    }
  } else if (performanceScore >= 75) {
    rate = 0.15;
  } else {
    rate = 0.0;
  }

  final double increase = baseBonus * rate;
  final double annualBonus = baseBonus + increase;

  print('Increase Rate     : ${(rate * 100).toStringAsFixed(0)}%');
  print('Increase Amount   : \$${increase.toStringAsFixed(2)}');
  print('Annual Bonus      : \$${annualBonus.toStringAsFixed(2)}');
}
'''

FILES["ex02.dart"] = r'''
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
'''

FILES["ex03.dart"] = r'''
// Exercise 3 - University Scholarship Evaluation
// Pure nested if-else decision tree.

// ---------- INPUT ----------
const double gpa = 3.85;
const double familyIncome = 1200;
const int volunteerHours = 120;

void main() {
  print('GPA             : $gpa');
  print('Family Income   : \$${familyIncome.toStringAsFixed(2)}');
  print('Volunteer Hours : $volunteerHours');

  String award;
  if (gpa < 3.0) {
    award = 'No Scholarship';
  } else {
    if (gpa >= 3.8) {
      if (familyIncome < 1500) {
        award = 'Full Scholarship';
      } else {
        award = '75% Scholarship';
      }
    } else if (gpa >= 3.5) {
      if (volunteerHours >= 100) {
        award = '50% Scholarship';
      } else {
        award = '25% Scholarship';
      }
    } else {
      award = 'Admission Only';
    }
  }

  print('Award           : $award');
}
'''

FILES["ex04.dart"] = r'''
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
'''

FILES["ex05.dart"] = r'''
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
'''

FILES["ex06.dart"] = r'''
// Exercise 6 - Banking Loan Approval
// Nested if-else decision tree with a reason for every branch.

// ---------- INPUT ----------
const int creditScore = 720;
const double monthlyIncome = 4500;
const double existingDebtPercent = 30;
const int employmentYears = 3;

void main() {
  String status;
  String reason;

  if (creditScore < 600) {
    status = 'Rejected';
    reason = 'Credit score below 600';
  } else if (monthlyIncome >= 4000) {
    if (existingDebtPercent < 35) {
      if (employmentYears >= 2) {
        status = 'Approved';
        reason = 'Strong income, low debt and stable employment';
      } else {
        status = 'Conditional Approval';
        reason = 'Employment history under 2 years';
      }
    } else {
      status = 'Rejected';
      reason = 'Existing debt is 35% or more';
    }
  } else if (creditScore >= 750) {
    status = 'Conditional Approval';
    reason = 'Excellent credit score but income below \$4000';
  } else {
    status = 'Rejected';
    reason = 'Income below \$4000 and credit score under 750';
  }

  print('Credit Score    : $creditScore');
  print('Monthly Income  : \$${monthlyIncome.toStringAsFixed(2)}');
  print('Existing Debt   : ${existingDebtPercent.toStringAsFixed(0)}%');
  print('Employment      : $employmentYears year(s)');
  print('Loan Status     : $status');
  print('Reason          : $reason');
}
'''

FILES["ex07.dart"] = r'''
// Exercise 7 - Hospital Priority Queue
// Nested if-else triage ladder.

// ---------- INPUT ----------
const int age = 70;
const int heartRate = 118;
const double temperature = 39.8;
const int injuryLevel = 6;

void main() {
  String priority;

  if (heartRate > 140) {
    priority = 'Emergency';
  } else {
    if (injuryLevel >= 8) {
      priority = 'Critical';
    } else {
      if (temperature >= 39.5) {
        priority = 'Urgent';
      } else {
        if (age >= 65) {
          priority = 'Priority';
        } else {
          priority = 'Normal';
        }
      }
    }
  }

  print('Age              : $age');
  print('Heart Rate       : $heartRate bpm');
  print('Temperature      : $temperature C');
  print('Injury Level     : $injuryLevel');
  print('Waiting Priority : $priority');
}
'''

FILES["ex08.dart"] = r'''
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
'''

FILES["ex09.dart"] = r'''
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
'''

FILES["ex10.dart"] = r'''
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
'''

for name, body in FILES.items():
    (OUT / name).write_text(body.lstrip("\n"))
print("wrote", len(FILES), "files")
