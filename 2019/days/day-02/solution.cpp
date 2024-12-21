#include <bits/stdc++.h>

void optimize_io() {
  std::cin.sync_with_stdio(false);
  std::cin.tie(NULL);
}

template <typename T>
using v = std::vector<T>;

v<int> input_nums;
const int add = 1;
const int multiple = 2;
const int max_range = 99;

void read_input() {
  std::ifstream f("in");
  std::string line;
  const char separator = ',';
  while (std::getline(f, line, separator)) {
    input_nums.push_back(std::stoi(line));
  }
  f.close();
}

void replace_starting_addresses() {
  input_nums[1] = 12;
  input_nums[2] = 2;
}

int calculate_intcode(v<int> nums) {
  for (int n = 0, opcode, param1, param2; n < input_nums.size() - 3; n += 4) {
    int& param3 = nums[nums[n + 3]];
    param2 = nums[nums[n + 2]];
    param1 = nums[nums[n + 1]];
    opcode = nums[n];
    if (opcode == max_range) break;
    else if (opcode == add) param3 = param1 + param2;
    else if (opcode == multiple) param3 = param1 * param2;
  }
  return nums[0];
}

int calculate_formula_of_pair() {
  const int match = 19690720;
  for (int p1 = 0; p1 <= max_range; ++p1) {
    for (int p2 = 0; p2 <= max_range; ++p2) {
      v<int> test_nums = input_nums;
      test_nums[1] = p1;
      test_nums[2] = p2;
      if (calculate_intcode(test_nums) == match) {
        return 100 * p1 + p2;
      }
    }
  }
  return 0;
}

int main() {
  optimize_io();
  read_input();
  replace_starting_addresses();
  std::cout << "Part one: " << calculate_intcode(input_nums) << "\n";
  std::cout << "Part two: " << calculate_formula_of_pair() << "\n";
  return 0;
}