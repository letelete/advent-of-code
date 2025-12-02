package main

import (
	"bufio"
	"bytes"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type Range struct {
	Min int64
	Max int64
}

func countDigits(num int64) int {
	n := 1
	for int64(math.Pow10(n)) <= num {
		n++
	}
	return n
}

func extractDigits(num int64) []int {
	digitsCount := countDigits(num)
	if digitsCount == 0 {
		return []int{}
	}
	digits := make([]int, 0, digitsCount)
	for num > 0 {
		digits = append(digits, int(num%10))
		num /= 10
	}
	return digits
}

func hasRepeatedSequence(digits []int) bool {
	if len(digits)%2 != 0 {
		return false
	}
	mid := len(digits) / 2
	for l, r := 0, mid; l < mid && r < len(digits); l, r = l+1, r+1 {
		if digits[l] != digits[r] {
			return false
		}
	}
	return true
}

func hasManyRepeatedSequences(digits []int) bool {
	sliceEq := func(a, b []int) bool {
		if len(a) != len(b) {
			return false
		}
		for i := range a {
			if a[i] != b[i] {
				return false
			}
		}
		return true
	}
	for _len := 1; _len <= len(digits)/2; _len++ {
		win := digits[:_len]
		allEq := len(digits)%_len == 0
		for i := _len; i+_len <= len(digits) && allEq; i += _len {
			if !sliceEq(win, digits[i:i+_len]) {
				allEq = false
			}
		}
		if allEq {
			return true
		}
	}
	return false
}

func main() {
	testData := readFile("test.txt")
	fmt.Println("[test case] part 1:", part1(testData), ", expected: ", 1227775554)
	fmt.Println("[test case] part 2:", part2(testData), ", expected: ", 4174379265)
	data := readFile("in.txt")
	fmt.Println("part 1:", part1(data))
	fmt.Println("part 2:", part2(data))
}

func part1(data []Range) int64 {
	sumInvalidIds := func(r *Range) int64 {
		var invalidIdsSum int64
		for i := r.Min; i <= r.Max; i++ {
			digits := extractDigits(i)
			if hasRepeatedSequence(digits) {
				invalidIdsSum += i
			}
		}
		return invalidIdsSum
	}
	var invalidIdsSum int64
	for _, r := range data {
		invalidIdsSum += sumInvalidIds(&r)
	}
	return invalidIdsSum
}

func part2(data []Range) int64 {
	sumInvalidIds := func(r *Range) int64 {
		var invalidIdsSum int64
		for i := r.Min; i <= r.Max; i++ {
			digits := extractDigits(i)
			if hasManyRepeatedSequences(digits) {
				invalidIdsSum += i
			}
		}
		return invalidIdsSum
	}
	var invalidIdsSum int64
	for _, r := range data {
		invalidIdsSum += sumInvalidIds(&r)
	}
	return invalidIdsSum
}

func readFile(filename string) []Range {
	splitByComma := func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if i := bytes.IndexByte(data, ','); i >= 0 {
			return i + 1, data[:i], nil
		}
		if atEOF && len(data) > 0 {
			return len(data), data, nil
		}
		return 0, nil, nil
	}

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

	out := []Range{}
	scanner := bufio.NewScanner(f)
	scanner.Split(splitByComma)
	for scanner.Scan() {
		rangeEntry := strings.TrimSpace(scanner.Text())
		if rangeEntry == "" {
			continue
		}
		if next, err := deserialize(rangeEntry); err != nil {
			panic(fmt.Sprintf("cannot deserialize range entry %q: %v", rangeEntry, err))
		} else {
			out = append(out, next)
		}
	}
	if err := scanner.Err(); err != nil {
		panic(fmt.Sprintf("error reading file %q: %v", path, err))
	}

	return out
}

func deserialize(raw string) (Range, error) {
	nums := make([]int64, 0, 2)
	for _, _r := range strings.Split(raw, "-") {
		num, err := strconv.ParseInt(_r, 10, 64)
		if err != nil {
			return Range{}, fmt.Errorf("cannot convert to number in range %q: %v", raw, err)
		}
		nums = append(nums, num)
	}
	return Range{nums[0], nums[1]}, nil
}
