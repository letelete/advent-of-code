package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
)

type Range struct {
	Min int
	Max int
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func main() {
	testData, testIdsSize := readFile("test.txt")
	fmt.Println("[test case] part 1:", part1(testData, testIdsSize), ", expected: ", 3)
	fmt.Println("[test case] part 2:", part2(makeRanges(testData, testIdsSize)), ", expected: ", 14)
	data, idsSize := readFile("in.txt")
	fmt.Println("part 1:", part1(data, idsSize))
	fmt.Println("part 2:", part2(makeRanges(data, idsSize)))
}

func part1(data []int, idsSize int) int {
	sum := 0
	valid := data[:idsSize]
	for _, id := range data[idsSize:] {
		ok := false
		for i := 0; i < idsSize; i += 2 {
			if id >= valid[i] && id <= valid[i+1] {
				ok = true
			}
		}
		if ok {
			sum++
		}
	}
	return sum
}

func part2(ids []Range) int {
	slices.SortFunc(ids, func(a, b Range) int {
		return a.Min - b.Min
	})
	sum := 0
	for l := 0; l < len(ids); l++ {
		max := ids[l].Max
		for r := l + 1; r < len(ids) && ids[r].Min <= max; r++ {
			max = maxInt(ids[r].Max, max)
			l = r
		}
		sum += 1 + max - ids[l].Min
	}
	return sum
}

func readFile(filename string) ([]int, int) {
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
	arr := []int{}
	idsSize := 0
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if len(line) == 0 {
			continue
		}
		if strings.Contains(line, "-") {
			idsSize += 2
			for part := range strings.SplitSeq(line, "-") {
				x, err := strconv.Atoi(part)
				if err != nil {
					panic(fmt.Sprintf("cannot convert to int %q: %v", part, err))
				}
				arr = append(arr, x)
			}
		} else {
			x, err := strconv.Atoi(line)
			if err != nil {
				panic(fmt.Sprintf("cannot convert to int %q: %v", line, err))
			}
			arr = append(arr, x)
		}
	}
	if err := scanner.Err(); err != nil {
		panic(fmt.Sprintf("error reading file %q: %v", path, err))
	}
	return arr, idsSize
}

func makeRanges(data []int, idsSize int) []Range {
	r := make([]Range, 0, idsSize/2)
	for i := 0; i < idsSize; i += 2 {
		r = append(r, Range{data[i], data[i+1]})
	}
	return r
}
