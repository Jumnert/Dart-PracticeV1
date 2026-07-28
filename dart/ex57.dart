// Exercise 57 - University Scholarship Evaluation System
// displayReport() calls calculateAverage(), grade() and isEligible().

// ---------- INPUT ----------
const String student = 'Chan Mealea';
const List<double> studentScores = [94, 91, 96, 89, 92];
const int studentAttendance = 97;
const bool hasDisciplinaryRecord = false;

double calculateAverage(List<double> scores) =>
    scores.fold<double>(0, (sum, score) => sum + score) / scores.length;

String grade(double average) => average >= 90
    ? 'A'
    : average >= 80
        ? 'B'
        : average >= 70
            ? 'C'
            : average >= 60
                ? 'D'
                : 'F';

bool isEligible({
  required double average,
  required int attendance,
  required bool disciplinaryRecord,
}) =>
    average >= 90 && attendance >= 95 && !disciplinaryRecord;

void displayReport({
  required String studentName,
  required List<double> scores,
  required int attendance,
  required bool disciplinaryRecord,
}) {
  final double avg = calculateAverage(scores);
  final bool eligible = isEligible(
    average: avg,
    attendance: attendance,
    disciplinaryRecord: disciplinaryRecord,
  );

  print('========== SCHOLARSHIP REPORT ==========');
  print('Student Name : $studentName');
  print('Average      : ${avg.toStringAsFixed(2)}');
  print('Grade        : ${grade(avg)}');
  print('Attendance   : $attendance %');
  print('Discipline   : ${disciplinaryRecord ? 'Bad' : 'Good'}');
  print('Scholarship  : ${eligible ? 'Eligible' : 'Not Eligible'}');
}

void main() {
  displayReport(
    studentName: student,
    scores: studentScores,
    attendance: studentAttendance,
    disciplinaryRecord: hasDisciplinaryRecord,
  );
}
