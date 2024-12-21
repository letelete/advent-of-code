#include <bits/stdc++.h>

void optimize_io() {
  std::cin.sync_with_stdio(false);
  std::cin.tie(NULL);
}

template <typename T>
using v = std::vector<T>;

template <typename K, typename V>
using umap = std::unordered_map<K, V>;

template <class T>
T min(T a, T b) { return a > b ? b : a; }

umap<int, umap<int, bool>> first_wire;
v<umap<int, umap<int, int>>> steps(2);

struct Pos { int x, y; };

enum Dir { U, D, L, R };
Dir get_dir(char c) {
  Dir dir = U;
  switch (c) {
    case 'D': dir = D; break;
    case 'L': dir = L; break;
    case 'R': dir = R; break;
  }
  return dir;
}

struct Wire {
  Dir dir;
  Pos from, to;
  Wire(Pos from, Pos to) {
    this->from = from;
    this->to = to;
  }
};

struct Path {
  int from, to, axis;
  bool horizontal;

  Path(Wire wire) {
    Dir dir = wire.dir;
    this->from = dir == D || dir == U ? wire.from.y : wire.from.x;
    this->to = dir == D || dir == U ? wire.to.y : wire.to.x;
    this->axis = dir == D || dir == L ? -1 : 1;
    this->horizontal = dir == L || dir == R;
  }
};

struct Minimum {
  int distance = INT_MAX;
  int steps = INT_MAX;
} minimum;

int get_steps_sum(Pos pos) {
  return steps[0][pos.x][pos.y] + steps[1][pos.x][pos.y];
}

int get_intersection_distance(Pos intersection) {
  const Pos port = Pos{0, 0};
  return abs(port.x - intersection.x) + abs(port.y - intersection.y);
}

bool is_intersection(Pos pos) {
  bool not_port_coordinates = pos.x != 0 || pos.y != 0;
  return not_port_coordinates && first_wire[pos.x][pos.y];
}

void cache_wire_path(Wire wire, bool find_intersection, int &steps_count) {
  Path path = Path(wire);
  Pos pos = {wire.from.x, wire.from.y};

  auto is_in_range = [&path](int position) {
    bool is_axis_negative = path.axis == -1;
    int range = path.to;
    return is_axis_negative ? position >= range : position <= range;
  };

  for (int position = path.from; is_in_range(position); position += path.axis) {
    if (path.horizontal) pos.x = position;
    else pos.y = position;

    int &position_steps = steps[find_intersection][pos.x][pos.y];

    if (position_steps == 0) {
      ++steps_count;
      position_steps = steps_count;
    }

    if (find_intersection) {
      if (is_intersection(pos)) {
        int distance = get_intersection_distance(pos);
        int steps = get_steps_sum(pos);
        if ((steps <= minimum.steps) ||
            (steps == minimum.steps && distance <= minimum.distance)) {
          minimum.distance = distance;
          minimum.steps = steps;
        }
      }
    } else {
      first_wire[pos.x][pos.y] = true;
    }
  }
}

int get_path_distance(std::string &path) {
  std::string extracted_value = path.substr(1, path.size());
  return std::stoi(extracted_value);
}

Wire convert_to_wire(std::string &path, Pos &from) {
  int distance = get_path_distance(path);
  Wire wire = Wire(from, from);
  wire.dir = get_dir(path[0]);
  int &x = wire.to.x, &y = wire.to.y;
  switch (path[0]) {
    case 'U': y += distance; break;
    case 'D': y -= distance; break;
    case 'R': x += distance; break;
    case 'L': x -= distance; break;
  }
  from = wire.to;
  return wire;
}

int main() {
  optimize_io();

  const char separator = ',';
  std::ifstream in("in");
  std::string wire_path, line;

  Pos from;
  bool find_intersection;
  int steps_count, wire_index = 0;

  while (in >> line) {
    std::stringstream ss(line);
    from = {0, 0};
    steps_count = 0;
    find_intersection = wire_index == 1;
    while (std::getline(ss, wire_path, separator)) {
      Wire wire = convert_to_wire(wire_path, from);
      cache_wire_path(wire, find_intersection, steps_count);
    }
    ++wire_index;
  }

  in.close();

  std::cout << minimum.distance << " " << minimum.steps << "\n";

  return 0;
}