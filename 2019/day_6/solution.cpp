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

umap<str, v<str>> orbits;

const str base_orbit_id = "COM";

int count_children(str parent_id, int nestedness, int part_sum) {
  const v<str>& children = orbits[parent_id];
  int total = 0;
  part_sum += nestedness;

  bool has_reached_end = children.empty();
  if (has_reached_end) return part_sum;

  for (const str& child : children) {
    total += count_children(child, nestedness + 1, part_sum);
    part_sum = 0;
  }

  return total;
}

bool found = false;
int get_distance_to_santa(str parent_id = base_orbit_id, int nestedness = 0) {
  const v<str>& children = orbits[parent_id];
  int distance = 0;
  
  if (parent_id == "SAN" || parent_id == "YOU") {
    found = true;
    return nestedness;
  } else if (children.empty()) {
    return 0;
  }

  int og_nestedness = nestedness;
  for (const str& child : children) {
    if (!found) nestedness = -1;
    distance += get_distance_to_santa(child, nestedness + 1);
    nestedness = og_nestedness;
  }

  return distance;
}

int get_numbers_of_orbits() { return count_children(base_orbit_id, 0, 0); }

std::pair<str, str> split_relation(str relation) {
  const char delimiter = ')';
  int last_index_of_first_orbit = relation.find(delimiter);

  return std::make_pair(
      relation.substr(0, last_index_of_first_orbit),
      relation.substr(last_index_of_first_orbit + 1, relation.size()));
}

void read_input() {
  std::ifstream in("in");
  str relation;
  while (in >> relation) {
    auto relation_pair = split_relation(relation);
    orbits[relation_pair.first].push_back(relation_pair.second);
  }
}

int main() {
  optimize_io();

  read_input();

  std::cout << "Part one: " << get_numbers_of_orbits() << "\n";
  std::cout << "Part two: " << get_distance_to_santa() << "\n";

  return 0;
}