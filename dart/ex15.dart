// Exercise 15 - Sales Report (12 months x 5 products, nested loops)

// ---------- INPUT ----------
const List<String> products = ['Laptop', 'Phone', 'Tablet', 'Watch', 'Camera'];
const List<List<double>> sales = [
  // Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
  [120, 135, 150, 128, 142, 160, 155, 148, 138, 170, 190, 210],
  [300, 280, 320, 340, 360, 355, 370, 390, 380, 410, 450, 500],
  [90, 85, 100, 95, 110, 105, 120, 115, 108, 125, 140, 150],
  [60, 55, 70, 65, 80, 75, 90, 85, 78, 95, 110, 120],
  [40, 38, 45, 42, 50, 48, 55, 52, 47, 60, 70, 80],
];
const List<String> months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

void main() {
  print('--- Monthly Totals ---');
  double highestMonthlySale = -1;
  String highestMonthlyLabel = '';

  for (int m = 0; m < months.length; m++) {
    double monthTotal = 0;
    for (int p = 0; p < products.length; p++) {
      monthTotal += sales[p][m];
      if (sales[p][m] > highestMonthlySale) {
        highestMonthlySale = sales[p][m];
        highestMonthlyLabel = '${products[p]} in ${months[m]}';
      }
    }
    print('${months[m]} : \$${monthTotal.toStringAsFixed(2)}');
  }

  print('');
  print('--- Product Yearly Totals ---');
  double best = -1;
  double worst = double.infinity;
  String bestProduct = '';
  String worstProduct = '';

  for (int p = 0; p < products.length; p++) {
    double yearTotal = 0;
    for (int m = 0; m < months.length; m++) {
      yearTotal += sales[p][m];
    }
    print('${products[p].padRight(7)} : \$${yearTotal.toStringAsFixed(2)}');
    if (yearTotal > best) {
      best = yearTotal;
      bestProduct = products[p];
    }
    if (yearTotal < worst) {
      worst = yearTotal;
      worstProduct = products[p];
    }
  }

  print('');
  print('Best-selling  : $bestProduct (\$${best.toStringAsFixed(2)})');
  print('Worst-selling : $worstProduct (\$${worst.toStringAsFixed(2)})');
  print('Highest Sale  : \$${highestMonthlySale.toStringAsFixed(2)} - $highestMonthlyLabel');
}
