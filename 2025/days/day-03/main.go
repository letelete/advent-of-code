package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func Conv(c rune) int {
	return int(c - '0')
}

func IntMax(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func main() {
	testData := readFile("test.txt")
	fmt.Println("[test case] part 1:", part1(testData), ", expected: ", 357)
	fmt.Println("[test case] part 2:", part2(testData), ", expected: ", 3121910778619)
	data := readFile("in.txt")
	fmt.Println("part 1:", part1(data))
	fmt.Println("part 2:", part2(data))
}

func memo(currentDigitsCount int, digitsCount int, line string, dp []int) []int {
	if currentDigitsCount > digitsCount {
		return dp
	}
	newDp := make([]int, len(dp))
	if currentDigitsCount == 1 {
		for i := range line {
			if i == 0 {
				newDp[i] = 0
				continue
			}
			newDp[i] = IntMax(newDp[i-1], Conv(rune(line[i-1])))
		}
		return memo(currentDigitsCount+1, digitsCount, line, newDp)
	}
	for i := range line {
		if i < currentDigitsCount {
			newDp[i] = 0
			continue
		}
		val := dp[i-1]*10 + Conv(rune(line[i-1]))
		if i > 0 {
			newDp[i] = IntMax(newDp[i-1], val)
		} else {
			newDp[i] = val
		}
	}
	return memo(currentDigitsCount+1, digitsCount, line, newDp)
}

func findMax(dp []int, line string) int {
	max := 0
	for i, ch := range line {
		if i > 0 {
			val := dp[i]*10 + Conv(ch)
			max = IntMax(max, val)
		}
	}
	return max
}

func part1(data []string) int {
	sum := 0
	for _, line := range data {
		sum += findMax(memo(1, 1, line, make([]int, len(line))), line)
	}
	return sum
}

func part2(data []string) int {
	sum := 0
	for _, line := range data {
		sum += findMax(memo(1, 11, line, make([]int, len(line))), line)
	}
	return sum
}

func readFile(filename string) []string {
	path, err := filepath.Abs(filename)
	if err != nil {
		panic(fmt.Sprintf("cannot get absolute path for %q: %v", filename, err))
	}
	f, err := os.Open(path)
	if err != nil {
		panic(fmt.Sprintf("cannot open file %q: %v", path, err))
	}
	defer func() {
		if err := f.Close(); err != nil {
			panic(fmt.Sprintf("cannot close file %q: %v", path, err))
		}
	}()

	out := []string{}
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}
		out = append(out, line)
	}
	if err := scanner.Err(); err != nil {
		panic(fmt.Sprintf("error reading file %q: %v", path, err))
	}

	return out
}
