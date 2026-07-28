// Exercise 38 - Number Guessing Tournament (do...while only, no for loop)
import 'dart:math';

// ---------- INPUT ----------
const int rounds = 10;
const int maxNumber = 100;
const int seed = 11;

void main() {
  final random = Random(seed);

  int round = 0;
  int totalAttempts = 0;
  int bestAttempts = 1 << 30;
  int worstAttempts = 0;
  int bestRound = 0;
  int worstRound = 0;

  do {
    round++;
    final int secret = random.nextInt(maxNumber) + 1;

    // The "player" plays a binary search: low/high narrowing.
    int low = 1;
    int high = maxNumber;
    int attempts = 0;
    int guess;

    do {
      guess = (low + high) ~/ 2;
      attempts++;
      if (guess < secret) {
        low = guess + 1;
      } else if (guess > secret) {
        high = guess - 1;
      }
    } while (guess != secret);

    totalAttempts += attempts;
    if (attempts < bestAttempts) {
      bestAttempts = attempts;
      bestRound = round;
    }
    if (attempts > worstAttempts) {
      worstAttempts = attempts;
      worstRound = round;
    }

    print('Round ${round.toString().padLeft(2)} : attempts used = $attempts, correct guess = $guess');
  } while (round < rounds);

  print('');
  print('Total Attempts   : $totalAttempts');
  print('Average Attempts : ${(totalAttempts / rounds).toStringAsFixed(2)}');
  print('Best Round       : Round $bestRound ($bestAttempts attempts)');
  print('Worst Round      : Round $worstRound ($worstAttempts attempts)');
}
