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
