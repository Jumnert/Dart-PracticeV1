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
