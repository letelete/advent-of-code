#!/bin/bash

aoc_year="$1"
aoc_star_gold="../assets/star-gold.svg"
aoc_star_silver="../assets/star-silver.svg"
aoc_star_gray="../assets/star-gray.svg"

table=""
table+="| Day | Stars | Benchmark | Problem |"$'\n'
table+="| --- | --- | --- | --- |"$'\n'

for dir in ../../$aoc_year/days/day-*; do
  if [ -d "$dir" ]; then
    day_number=$(basename "$dir" | sed 's/day-0*//')
    day_link="[$day_number](./days/$(basename $dir))"
    benchmark=""
    stars=""
    aoc_link="[Open on AoC](https://adventofcode.com/$aoc_year/day/$day_number)"

    if [ -x "./parse-day-benchmark.sh" ]; then
      benchmark=$(./parse-day-benchmark.sh "$dir/README.md")

      if [ -z "$benchmark" ]; then
        stars="![no-star]($aoc_star_gray) ![no-star]($aoc_star_gray)"
      elif [[ "$benchmark" == *"|"* ]]; then
        stars="![gold-star]($aoc_star_gold) ![gold-star]($aoc_star_gold)"
      else
        stars="![gold-star]($aoc_star_gold) ![silver-star]($aoc_star_silver)"
      fi
    else
      echo "parse-day-benchmark.sh not found or not executable"
      exit 1
    fi

    table+="| $day_link | $stars | $benchmark | $aoc_link |"$'\n'
  fi
done

echo -e "$table"
