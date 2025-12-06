package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func arrMax(arr []int) int {
	max := arr[0]
	for _, x := range arr {
		if x > max {
			max = x
		}
	}
	return max
}

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

func partition(num, pad int) []int {
	cap := int(math.Floor(math.Log10(float64(num)))) + 1
	p := make([]int, pad)
	for i := range p {
		p[i] = -1
	}
	for i := range cap {
		p[pad-i-1] = num % 10
		num /= 10
	}
	return p
}

func (e *Expr) TransformNumbers() {
	pad := int(math.Floor(math.Log10(float64(arrMax(e.Numbers))))) + 1
	partitions := make([][]int, 0, len(e.Numbers))
	for _, x := range e.Numbers {
		partitions = append(partitions, partition(x, pad))
	}
	transformed := make([]int, 0, pad)
	for i := range pad {
		num := 0
		factor := 0
		for _, p := range partitions {
			if p[i] != -1 {
				if factor == 0 {
					factor = 1
				} else {
					factor *= 10
				}
			}
		}
		if factor == 0 {
			continue
		}
		for _, p := range partitions {
			if p[i] != -1 {
				num += p[i] * factor
				factor /= 10
			}
		}
		transformed = append(transformed, num)
	}
	e.Numbers = transformed
}

func main() {
	testData := readFile("test.txt")
	for _, x := range testData {
		fmt.Println("before", x.Numbers)
		x.TransformNumbers()
		fmt.Println("after", x.Numbers)
	}
	fmt.Println("[test case] part 1:", part1(testData), ", expected: ", 4277556)
	fmt.Println("[test case] part 2:", part2(testData), ", expected: ", 0)
	data := readFile("in.txt")
	fmt.Println("part 1:", part1(data))
	fmt.Println("part 2:", part2(data))
}

func part1(data []Expr) int {
	sum := 0
	for _, e := range data {
		sum += e.Eval()
	}
	return sum
}

func part2(data []Expr) int {
	sum := 0
	return sum
}

func readFile(filename string) []Expr {
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

	out := []Expr{}
	numbers := [][]int{}

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		row := []int{}
		tokenI := 0
		for token := range strings.SplitSeq(scanner.Text(), " ") {
			if len(strings.TrimSpace(token)) == 0 {
				continue
			}
			num, err := strconv.Atoi(token)
			if err == nil {
				row = append(row, num)
			} else {
				// symbols line
				expr := Expr{make([]int, 0, len(numbers)), token[0]}
				for i := range numbers {
					expr.Numbers = append(expr.Numbers, numbers[i][tokenI])
				}
				out = append(out, expr)
			}
			tokenI++
		}
		if len(row) > 0 {
			numbers = append(numbers, row)
		}
	}
	if err := scanner.Err(); err != nil {
		panic(fmt.Sprintf("error reading file %q: %v", path, err))
	}
	return out
}
