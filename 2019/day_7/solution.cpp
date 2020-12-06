#include <bits/stdc++.h>

void optimize_io() {
  std::cin.sync_with_stdio(false);
  std::cin.tie(NULL);
}

typedef std::string str;

template <typename T>
using v = std::vector<T>;

template <typename K, typename V>
using umap = std::unordered_map<K, V>;

template <class T>
T min(T a, T b) {
  return a > b ? b : a;
}

template <class T>
T max(T a, T b) {
  return a > b ? a : b;
}

template <class T>
T pow(T a, int b = 2) {
  if (b == 0) return 1;
  int temp = pow(a, b / 2);
  if (b % 2 == 0) return temp * temp;
  return a * temp * temp;
}

v<int> original_memory;
v<int> memory;

enum Opcodes : int {
  add = 1,
  multiple = 2,
  input = 3,
  output = 4,
  jump_if_true = 5,
  jump_if_false = 6,
  less_than = 7,
  equals = 8,
  halt = 99
};

enum Modes : int { position = 0, immediate = 1 };

struct Instruction {
  const int opcode_length = 1;
  const int params_length = 2;

  Opcodes opcode;
  v<int> indexes;
  int instruction_code;
  int opcode_index;

  int digit_index = 0;

  int nth_num_digit(int index, int num) { return num / pow(10, index) % 10; }

  Opcodes get_opcode() {
    int opcode = 0;
    int index = opcode_length;
    while (index >= 0) {
      opcode += nth_num_digit(index, instruction_code) * pow(10, index);
      --index;
      ++digit_index;
    }
    return Opcodes(opcode);
  }

  v<int> get_indexes() {
    v<int> indexes;
    int param_origin_index, param_final_index;

    for (int i = 1; i <= params_length; ++i) {
      param_origin_index = opcode_index + i;
      Modes mode = Modes(nth_num_digit(digit_index, instruction_code));

      switch (mode) {
        case Modes::position:
          param_final_index = memory[param_origin_index];
          break;
        case Modes::immediate:
          param_final_index = param_origin_index;
          break;
        default:
          std::cout << "Error: Unrecognized mode; mode == " << mode << "\n";
      }

      indexes.push_back(param_final_index);
      ++digit_index;
    }
    return indexes;
  }

  Instruction(int opcode_index) {
    this->opcode_index = opcode_index;
    this->instruction_code = memory[opcode_index];
    this->opcode = get_opcode();
    this->indexes = get_indexes();
  }
};

void initialize_memory() { memory = original_memory; }

int get_diagnostic_code(int system_id) {
  initialize_memory();

  int diagnostic_code, index;
  index = 0;

  while (memory[index] != Opcodes::halt) {
    switch (memory[index]) {
      case Opcodes::input:
        memory[memory[index + 1]] = system_id;
        index += 2;
        break;
      default:
        Instruction ins = Instruction(index);
        int& param_1 = memory[ins.indexes[0]];
        int& param_2 = memory[ins.indexes[1]];

        // Third param's mode is always in the Modes::position, so we don't need
        // to calculate its index.
        int& output_param = memory[memory[index + 3]];

        switch (ins.opcode) {
          case Opcodes::add:
            output_param = param_1 + param_2;
            index += 4;
            break;
          case Opcodes::multiple:
            output_param = param_1 * param_2;
            index += 4;
            break;
          case Opcodes::output:
            diagnostic_code = memory[memory[index + 1]];
            index += 2;
            break;
          case Opcodes::jump_if_true:
            index = param_1 ? param_2 : index + 3;
            break;
          case Opcodes::jump_if_false:
            index = !param_1 ? param_2 : index + 3;
            break;
          case Opcodes::less_than:
            output_param = param_1 < param_2;
            index += 4;
            break;
          case Opcodes::equals:
            output_param = param_1 == param_2;
            index += 4;
            break;
          default:
            std::cout << "Error: Unrecognized opcode; opcode == " << ins.opcode
                      << "\n";
            return -1;
        }
    }
  }

  return diagnostic_code;
}

void read_input() {
  std::ifstream in("in");
  std::string match;
  while (std::getline(in, match, ',')) {
    int number = std::stoi(match);
    original_memory.push_back(number);
  }
  in.close();
}

v<int> greedy_highest_signal(v<int> highest, int next_digit) {
  for (int i = 0; i < highest.size(); ++i) {
    if (next_digit > highest[i]) {
      highest.insert(highest.begin() + i, next_digit);
      highest.pop_back();
      break;
    }
  }
  return highest;
}

int convert_vector_to_int(const v<int>& vec) {
  int num = 0;
  for (int i = 0, j = 10000; i < vec.size(); ++i, j / 10) {
    num += vec[i];
  }
  return num;
}

int get_highest_signal() {
  const v<int> phases{{0, 1, 2, 3, 4}};
  v<int> highest_signal(5, 0);

  int next_code_digit;
  for (const int& phase : phases) {
    next_code_digit = get_diagnostic_code(phase);
    highest_signal =
        greedy_highest_signal(highest_signal, next_code_digit % 10);
  }
  return convert_vector_to_int(highest_signal);
}

int main() {
  original_memory = {
      {3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0}};
  assert(get_highest_signal() == 43210);
  std::cout << "OK, 43210\n";

  original_memory = {{3, 23, 3,  24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101,
                      5, 23, 23, 1,  24,   23, 23, 4,  23,   99, 0,  0}};
  assert(get_highest_signal() == 54321);
  std::cout << "OK, 54321\n";

  original_memory = {{3,    31, 3,  32, 1002, 32, 10, 32, 1001, 31, -2, 31,
                      1007, 31, 0,  33, 1002, 33, 7,  33, 1,    33, 31, 31,
                      1,    32, 31, 31, 4,    31, 99, 0,  0,    0}};
  assert(get_highest_signal() == 65210);
  std::cout << "OK, 65210\n";

  original_memory.clear();
  read_input();
  std::cout << "Highest digit is: " << get_highest_signal() << "\n";
}