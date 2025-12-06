package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type Expr struct {
	Numbers []int
	Symbol  byte
}

func (e *Expr) Op(a, b int) int {
	switch e.Symbol {
	case '+':
		return a + b
	case '*':
		return a * b
	default:
		panic("unknown symbol")
	}
}

func (e *Expr) Eval() int {
	out := e.Numbers[0]
	for _, num := range e.Numbers[1:] {
		out = e.Op(out, num)
	}
	return out
}

func sumExpr(expr []Expr) int {
	sum := 0
	for _, e := range expr {
		sum += e.Eval()
	}
	return sum
}

func toReversed(arr []string) []string {
	a := make([]string, len(arr))
	copy(a, arr)
	for i, j := 0, len(a)-1; i < j; i, j = i+1, j-1 {
		a[i], a[j] = a[j], a[i]
	}
	return a
}

func main() {
	fmt.Println("[test case] part 1:", part1(readFile("test.txt", parsePart1)), ", expected: ", 4277556)
	fmt.Println("[test case] part 2:", part2(readFile("test.txt", parsePart2)), ", expected: ", 3263827)
	fmt.Println("part 1:", part1(readFile("in.txt", parsePart1)))
	fmt.Println("part 2:", part2(readFile("in.txt", parsePart2)))
}

func part1(data []Expr) int {
	return sumExpr(data)
}

func part2(data []Expr) int {
	return sumExpr(data)
}

func parsePart1(s *bufio.Scanner) []Expr {
	out := []Expr{}
	numbers := [][]int{}
	for s.Scan() {
		row := []int{}
		tokenIndex := 0
		for token := range strings.SplitSeq(s.Text(), " ") {
			if len(strings.TrimSpace(token)) == 0 {
				continue
			}
			num, err := strconv.Atoi(token)
			if err == nil {
				row = append(row, num)
			} else {
				expr := Expr{make([]int, 0, len(numbers)), token[0]}
				for i := range numbers {
					expr.Numbers = append(expr.Numbers, numbers[i][tokenIndex])
				}
				out = append(out, expr)
			}
			tokenIndex++
		}
		if len(row) > 0 {
			numbers = append(numbers, row)
		}
	}
	return out
}

func parsePart2(s *bufio.Scanner) []Expr {
	getOffset := func(start int, line string) int {
		offset := 1
		for (start+offset < len(line) && line[start+offset] == ' ') || (start+offset == len(line)) {
			offset++
		}

		return offset
	}

	raw := []string{}
	for s.Scan() {
		raw = append(raw, s.Text())
	}

	out := []Expr{}

	start := []int{}
	end := []int{}
	symbolsLine := raw[len(raw)-1]
	numsLines := raw[:len(raw)-1]

	for i := 0; i < len(symbolsLine); i++ {
		if symbolsLine[i] != ' ' {
			offset := getOffset(i, symbolsLine)
			if offset < 1 {
				panic(fmt.Errorf("invalid state: offset '%v' < 1 for line '%v' at %v", offset, symbolsLine, i))
			}
			start = append(start, i)
			end = append(end, i+offset)
			i += offset - 1
		}
	}

	for i := range start {
		_start := start[i]
		_end := end[i]
		pad := _end - _start - 1
		transformed := make([]int, 0, pad)
		for padIndex := range pad {
			num := 0
			factor := 1
			for _, line := range toReversed(numsLines) {
				entry := line[_start : _end-1]
				if entry[padIndex] != ' ' {
					num += int(entry[padIndex]-'0') * factor
					factor *= 10
				}
			}
			transformed = append(transformed, num)
		}
		out = append(out, Expr{transformed, symbolsLine[start[i]]})
	}

	return out
}

func readFile(filename string, parse func(s *bufio.Scanner) []Expr) []Expr {
	path, err := filepath.Abs(filename)
	if err != nil {
		panic(fmt.Sprintf("cannot get absolute path for %q: %v", filename, err))
	}

	f, err := os.Open(path)
	if err != nil {
		panic(fmt.Sprintf("cannot open file %q: %v", path, err))
	}

	s := bufio.NewScanner(f)
	out := parse(s)

	if err := s.Err(); err != nil {
		panic(fmt.Sprintf("error reading file %q: %v", path, err))
	}
	if err := f.Close(); err != nil {
		panic(fmt.Sprintf("cannot close file %q: %v", path, err))
	}

	return out
}
