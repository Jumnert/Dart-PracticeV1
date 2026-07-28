// Exercise 19 - Inventory Report (4 warehouses x 8 products)

// ---------- INPUT ----------
const List<String> warehouses = ['WH-A', 'WH-B', 'WH-C', 'WH-D'];
const List<String> products = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];
const List<List<int>> quantity = [
  [12, 40, 25, 8, 60, 33, 19, 45],
  [22, 15, 30, 12, 48, 27, 24, 39],
  [5, 60, 18, 20, 55, 41, 30, 50],
  [18, 28, 22, 14, 38, 29, 21, 42],
];

void main() {
  int grandTotal = 0;
  int highestWarehouseTotal = -1;
  String richestWarehouse = '';

  print('--- Warehouse Totals ---');
  for (int w = 0; w < warehouses.length; w++) {
    int total = 0;
    for (int p = 0; p < products.length; p++) {
      total += quantity[w][p];
    }
    grandTotal += total;
    print('${warehouses[w]} : $total');
    if (total > highestWarehouseTotal) {
      highestWarehouseTotal = total;
      richestWarehouse = warehouses[w];
    }
  }

  print('');
  print('--- Product Totals ---');
  int lowestProductTotal = 1 << 30;
  String lowestProduct = '';
  for (int p = 0; p < products.length; p++) {
    int total = 0;
    for (int w = 0; w < warehouses.length; w++) {
      total += quantity[w][p];
    }
    print('${products[p]} : $total');
    if (total < lowestProductTotal) {
      lowestProductTotal = total;
      lowestProduct = products[p];
    }
  }

  print('');
  print('Grand Total        : $grandTotal');
  print('Highest Inventory  : $richestWarehouse ($highestWarehouseTotal)');
  print('Lowest Stock       : $lowestProduct ($lowestProductTotal)');
}
