#include <iostream>
#include <numeric>
#include <unordered_map>
#include <vector>

std::vector<int> input;

void read_input() {
  int next;
  while (std::cin >> next) {
    input.push_back(next);
  }
}

// For the first task :) - [O(n)]
// #include <unordered_set>
//
// std::pair<int, int> find_pair_that_sums_up_to(std::vector<int>& arr,
//                                               int targetSum) {
//   std::unordered_set<int> sum_counters;
//   for (const auto& num : arr) {
//     if (sum_counters.count(num)) return std::make_pair(num, targetSum - num);
//     sum_counters.insert(targetSum - num);
//   }
//   return {-1, -1};
// }

std::vector<int> find_n_nums_that_sums_up_to(std::vector<int>& arr, int n,
                                             int targetSum,
                                             std::vector<int> nums = {},
                                             int lookup = 0) {
  if (n <= 0) return targetSum == 0 ? nums : std::vector<int>{};
  for (int i = lookup; i < arr.size() - n; i++) {
    int sum = targetSum - arr[i];
    auto next = nums;
    next.push_back(arr[i]);
    next = find_n_nums_that_sums_up_to(arr, n - 1, sum, next, i + 1);
    if (next.size()) return next;
  }
  return {};
}

void printAnswer(std::vector<int>& arr) {
  if (!arr.size()) {
    std::cout << "No numbers with given sum found\n";
    return;
  }
  int total = 1;
  for (int i = 0; i < arr.size(); ++i) {
    total *= arr[i];
    std::cout << arr[i] << (i == arr.size() - 1 ? " = " : " * ");
  }
  std::cout << total << "\n";
}

void part_1() {
  auto products = find_n_nums_that_sums_up_to(input, 2, 2020);
  printAnswer(products);
}

void part_2() {
  auto products = find_n_nums_that_sums_up_to(input, 3, 2020);
  printAnswer(products);
}

int main() {
  read_input();

  part_1();
  part_2();

  return 0;
}
