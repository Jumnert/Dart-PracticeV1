// Exercise 32 - ATM login with 3 attempts (while loop)

// ---------- INPUT (simulated PIN entries) ----------
const int correctPin = 1234;
const int maxAttempts = 3;
const List<int> entered = [1111, 4321, 1234];

void main() {
  int attempts = 0;
  bool granted = false;

  while (attempts < maxAttempts && !granted) {
    final int pin = entered[attempts];
    print('Enter PIN: $pin');
    attempts++;

    if (pin == correctPin) {
      granted = true;
    } else {
      print('Wrong PIN');
    }
  }

  if (granted) {
    print('Access Granted');
    print('Attempts used: $attempts');
  } else {
    print('Account Locked');
  }
}
