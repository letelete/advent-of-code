#include <algorithm>
#include <cctype>
#include <chrono>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <random>
#include <thread>
#include <unordered_map>
#include <vector>

using u32 = uint_least32_t;
using engine = std::mt19937;

std::random_device os_seed;
const u32 seed = os_seed();
engine generator(seed);

const char TREE_SYMBOL = '#';
const char EMPTY_SPACE_SYMBOL = '.';
const int VISUALIZE_ROW_DELAY_MS = 60;

std::vector<std::string> slope;

struct Colorizer {
  const std::string reset_suffix = "\e[49m\e[39m";
  enum color {
    foreground_dark_gray = 90,
  };

  std::string get_color_prefix(color color) {
    return "\e[" + std::to_string(color) + "m";
  }

  std::string colorize(std::string str, color color) {
    return get_color_prefix(color) + str + reset_suffix;
  }
} colorizer;

struct Runner {
  int row_shift;
  int col_shift;
  std::string icon;
  int tree_collisions;
  int row;
  int col;
};

void read_slope() {
  std::string next;
  while (std::cin >> next) slope.push_back(next);
}

bool has_encountered_tree(int row, int col) {
  return slope[row][col] == TREE_SYMBOL;
}

void visualize_row(int runner_row, int runner_col, int tree_collisions,
                   std::string player_emoji) {
  const std::string tree_symbol = "🎄";
  const std::string collision_symbol = "💥";
  std::string empty_space_symbol =
      colorizer.colorize(".", colorizer.color::foreground_dark_gray);

  for (int i = 0; i < slope[0].size(); ++i) {
    bool is_player_pos = i == runner_col;
    std::cout << (has_encountered_tree(runner_row, i)
                      ? is_player_pos ? collision_symbol : tree_symbol
                      : is_player_pos ? player_emoji : empty_space_symbol);
  }

  std::string collision_info = " | x ";
  std::cout << std::setfill(' ')
            << std::setw(std::ceil(std::log10(slope.size())) +
                         collision_info.length() + 1)
            << std::left
            << (tree_collisions
                    ? collision_info + std::to_string(tree_collisions)
                    : " |");
}

void setup_runners(std::vector<Runner>& runners) {
  const std::vector<std::string> runner_emojis{
      {"🟣", "🟡", "🔵", "🟢", "🔴", "🟠", "⚪️"}};

  std::uniform_int_distribution<u32> distribute(0, runner_emojis.size() - 1);

  for (auto& runner : runners) {
    runner.row = -1;
    runner.col = -runner.col_shift;
    runner.tree_collisions = 0;
    runner.icon = runner_emojis[distribute(generator)];
  }
}

void visualize_runners(std::vector<Runner>& runners) {
  int row = 0;

  setup_runners(runners);

  while (row < slope.size()) {
    for (auto& runner : runners) {
      bool has_new_collision = false;

      runner.row++;

      if (row % runner.row_shift == 0) {
        runner.col = (runner.col + runner.col_shift) % slope[0].size();
        has_new_collision = has_encountered_tree(runner.row, runner.col);
        runner.tree_collisions += has_new_collision;
      }

      visualize_row(runner.row, runner.col,
                    has_new_collision ? runner.tree_collisions : 0,
                    runner.icon);
    }

    ++row;
    std::cout << "\n";
    std::this_thread::sleep_for(
        std::chrono::milliseconds(VISUALIZE_ROW_DELAY_MS));
  }
}

void part_1() {
  std::vector<Runner> runners{{1, 3}};
  visualize_runners(runners);

  std::cout << "[Part 1] Answer: " << runners[0].tree_collisions << "\n";
}

void part_2() {
  std::vector<Runner> runners{{1, 1}, {1, 3}, {1, 5}, {1, 7}, {2, 1}};
  long long product = 1;

  visualize_runners(runners);

  std::cout << "[Part 2] Answer: ";
  for (unsigned i = 0; i < runners.size(); ++i) {
    std::cout << runners[i].tree_collisions
              << (i < runners.size() - 1 ? " * " : " = ");
    product *= runners[i].tree_collisions;
  }
  std::cout << product << "\n";
}

int main() {
  read_slope();

  part_1();

  part_2();

  return 0;
}