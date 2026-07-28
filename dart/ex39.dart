// Exercise 39 - Sales Performance System
// Restriction: only while / do...while, no List and no Map.
// Simulated input comes from a switch-based feed instead of a collection.

// ---------- INPUT ----------
double nextSales(int index) => switch (index) {
      0 => 6200,
      1 => 4500,
      2 => 2800,
      3 => 850,
      4 => 5100,
      5 => 3300,
      6 => 1500,
      7 => 990,
      _ => -999,
    };

double commissionRate(double sales) {
  if (sales >= 5000) return 0.15;
  if (sales >= 3000) return 0.10;
  if (sales >= 1000) return 0.05;
  return 0.02;
}

void main() {
  int index = 0;
  int employees = 0;
  double totalSales = 0;
  double totalCommission = 0;
  double highestSale = -1;
  double lowestSale = -1;
  double highestCommission = -1;
  double lowestCommission = -1;
  int excellent = 0, good = 0, average = 0, poor = 0;

  double sales = nextSales(index);
  while (sales != -999) {
    print('Enter monthly sales (-999 to stop): \$${sales.toStringAsFixed(2)}');
    employees++;

    final double commission = sales * commissionRate(sales);
    totalSales += sales;
    totalCommission += commission;

    if (highestSale < 0 || sales > highestSale) highestSale = sales;
    if (lowestSale < 0 || sales < lowestSale) lowestSale = sales;
    if (highestCommission < 0 || commission > highestCommission) highestCommission = commission;
    if (lowestCommission < 0 || commission < lowestCommission) lowestCommission = commission;

    if (sales >= 5000) {
      excellent++;
    } else if (sales >= 3000) {
      good++;
    } else if (sales >= 1000) {
      average++;
    } else {
      poor++;
    }

    index++;
    sales = nextSales(index);
  }

  print('');
  print('Total employees    : $employees');
  print('Highest sale       : \$${highestSale.toStringAsFixed(2)}');
  print('Lowest sale        : \$${lowestSale.toStringAsFixed(2)}');
  print('Highest commission : \$${highestCommission.toStringAsFixed(2)}');
  print('Lowest commission  : \$${lowestCommission.toStringAsFixed(2)}');
  print('Total sales        : \$${totalSales.toStringAsFixed(2)}');
  print('Total commission   : \$${totalCommission.toStringAsFixed(2)}');
  print('Average sales      : \$${(totalSales / employees).toStringAsFixed(2)}');
  print('Average commission : \$${(totalCommission / employees).toStringAsFixed(2)}');
  print('Excellent (>=5000) : $excellent');
  print('Good (3000-4999)   : $good');
  print('Average (1000-2999): $average');
  print('Poor (<1000)       : $poor');
}
