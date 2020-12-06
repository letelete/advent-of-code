#include <iostream>
#include <regex>
#include <vector>

struct Entry {
  int min;
  int max;
  char c;
  std::string password;

  void print() {
    std::cout << "min(" << min << ") max(" << max << ") c(" << c
              << ") password(" << password << ")\n";
  }
};

std::vector<Entry> entries;

void read_input() {
  std::regex pattern("^([0-9]{1,})-([0-9]{1,})\\s([a-zA-Z]):\\s(.+?)$");
  std::smatch sm;
  std::string raw;
  while (std::getline(std::cin, raw)) {
    std::regex_search(raw, sm, pattern);
    entries.push_back({
        std::stoi(sm.str(1)),
        std::stoi(sm.str(2)),
        static_cast<char>(sm.str(3)[0]),
        sm.str(4),
    });
  }
}

bool is_valid_with_old_policy(const Entry& entry) {
  int occurs = 0;
  for (const auto& character : entry.password) {
    occurs += character == entry.c;
  }
  return (occurs >= entry.min && occurs <= entry.max);
}

bool is_valid_with_official_policy(const Entry& entry) {
  int firstIndex = entry.min - 1;
  int secondIndex = entry.max - 1;
  return (entry.password[firstIndex] == entry.c &&
          entry.password[secondIndex] != entry.c) ||
         (entry.password[firstIndex] != entry.c &&
          entry.password[secondIndex] == entry.c);
}

void part_1() {
  int count = 0;
  for (const Entry& entry : entries) {
    count += is_valid_with_old_policy(entry);
  }
  std::cout << count << "\n";
}

void part_2() {
  int count = 0;
  for (const Entry& entry : entries) {
    count += is_valid_with_official_policy(entry);
  }
  std::cout << count << "\n";
}

int main() {
  read_input();

  part_1();
  part_2();

  return 0;
}
