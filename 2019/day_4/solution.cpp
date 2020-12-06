#include <bits/stdc++.h>

void optimize_io() {
  std::cin.sync_with_stdio(false);
  std::cin.tie(NULL);
}

struct Criteria {
  const int min_six_digit = 100000;
  const int max_six_digit = 999999;
  const int undeclared = -1;

  int num, last_digit, pair, digit;
  bool has_pair_of_two;

  bool descending_digit() { return last_digit < digit; }

  void check_for_pair_of_two() {
    if (digit == last_digit) {
      if (pair == undeclared || digit != pair) {
        if (!has_pair_of_two) {
          pair = digit;
          has_pair_of_two = true;
        }
      } else {
        has_pair_of_two = false;
      }
    }
  }

  bool are_satisfied_by(int num) {
    this->num = num;
    this->last_digit = undeclared;
    this->has_pair_of_two = false;
    this->pair = undeclared;

    while (num > 0) {
      digit = num % 10;
      if (last_digit != undeclared) {
        if (descending_digit()) return false;
        check_for_pair_of_two();
      }
      last_digit = digit;
      num /= 10;
    }
    return has_pair_of_two;
  }
} criteria;

int main() {
  optimize_io();
  const int input_min_range = 246515;
  const int input_max_range = 739105;

  int count = 0;
  for (int num = input_min_range; num <= input_max_range; ++num) {
    count += criteria.are_satisfied_by(num);
  }

  std::cout << count << "\n";

  return 0;
}
