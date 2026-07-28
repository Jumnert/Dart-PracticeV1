// Exercise 16 - Hotel Room System (6 floors x 20 rooms, seeded random occupancy)
import 'dart:math';

// ---------- INPUT ----------
const int floors = 6;
const int roomsPerFloor = 20;
const int seed = 7;

void main() {
  final random = Random(seed);
  int occupied = 0;
  int empty = 0;

  for (int floor = 1; floor <= floors; floor++) {
    for (int room = 1; room <= roomsPerFloor; room++) {
      final int number = floor * 100 + room;
      final bool isOccupied = random.nextBool();
      if (isOccupied) {
        occupied++;
      } else {
        empty++;
      }
      print('$number ${isOccupied ? 'Occupied' : 'Available'}');
    }
  }

  final int totalRooms = floors * roomsPerFloor;
  print('');
  print('Occupied Rooms : $occupied');
  print('Empty Rooms    : $empty');
  print('Occupancy Rate : ${(occupied / totalRooms * 100).toStringAsFixed(2)}%');
}
