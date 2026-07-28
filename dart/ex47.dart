// Exercise 47 - Login Validation

// ---------- INPUT ----------
const List<List<String>> attempts = [
  ['admin', '1234'],
  ['admin', '0000'],
  ['user', '1234'],
];

bool login(String username, String password) =>
    username == 'admin' && password == '1234';

void main() {
  for (final attempt in attempts) {
    final bool ok = login(attempt[0], attempt[1]);
    print('${attempt[0]} / ${attempt[1]} -> ${ok ? 'Login Success' : 'Login Failed'}');
  }
}
