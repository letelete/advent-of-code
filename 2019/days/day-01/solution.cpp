#include <bits/stdc++.h>

void optimize_io() {
  std::cin.sync_with_stdio(false);
  std::cin.tie(NULL);
}

template <typename T>
using v = std::vector<T>;

template <class T>
T max(T a, T b) {
  return a > b ? a : b;
}

int max_mass = INT_MIN;
v<int> weights;
v<int> fuel_dp;

void read_input() {
  std::ifstream in("in");
  int mass;
  std::string input;
  while (in >> input) {
    mass = std::stoi(input);
    weights.push_back(mass);
    max_mass = max(max_mass, mass);
  }
}

int calculate_fuel(int mass) {
  if (mass <= 0) return 0;
  return floor(mass / 3.0D) - 2;
}

int calculate_fuel_of_fuel(int mass) {
  if (fuel_dp[mass] != -1) return fuel_dp[mass];

  int fuel = calculate_fuel(mass);
  fuel_dp[mass] = fuel > 0 ? fuel : 0;
  if (fuel_dp[mass] > 0) {
    fuel_dp[mass] += calculate_fuel_of_fuel(fuel_dp[mass]);
  }
  return fuel_dp[mass];
}

int main() {
  optimize_io();
  read_input();

  int total_fuel = 0;
  for (const int& mass : weights) total_fuel += calculate_fuel(mass);
  std::cout << total_fuel << "\n";

  fuel_dp = v<int>(max_mass + 1, -1);
  int total_fuel_of_fuel = 0;
  for (const int& mass : weights) {
    total_fuel_of_fuel += calculate_fuel_of_fuel(mass);
  }
  std::cout << total_fuel_of_fuel << "\n";

  return 0;
}