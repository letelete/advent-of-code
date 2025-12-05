package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Point struct {
	row int
	col int
}

var dirs = [8]Point{{0, -1}, {0, 1}, {-1, 0}, {1, 0}, {-1, -1}, {-1, 1}, {1, -1}, {1, 1}}

type Grid struct {
	data [][]byte
}

func (g *Grid) Size() (int, int) {
	if len(g.data) == 0 {
		return 0, 0
	}
	return len(g.data), len(g.data[0])
}

func (g *Grid) InBounds(p *Point) bool {
	rows, cols := g.Size()
	if rows == 0 || cols == 0 {
		return false
	}
	return p.row >= 0 && p.row < rows && p.col >= 0 && p.col < cols
}

func (g *Grid) Walk(startAt *Point, fn func(p *Point)) {
	for row := range g.data {
		for col := range g.data[row] {
			fn(&Point{row, col})
		}
	}
}

func (g *Grid) IsRoll(p *Point) bool {
	return g.data[p.row][p.col] == '@'
}

func (g *Grid) RemoveRoll(p *Point) {
	g.data[p.row][p.col] = '.'
}

func (g *Grid) CountAdjacentRolls(p *Point) int {
	sum := 0
	for _, d := range dirs {
		newP := Point{p.row + d.row, p.col + d.col}
		if g.InBounds(&newP) && g.IsRoll(&newP) {
			sum++
		}
	}
	return sum
}

func (g *Grid) IsAccessibleByForklift(p *Point) bool {
	return g.IsRoll(p) && g.CountAdjacentRolls(p) < 4
}

func main() {
	testData := readFile("test.txt")
	fmt.Println("[test case] part 1:", part1(testData), ", expected: ", 13)
	fmt.Println("[test case] part 2:", part2(testData), ", expected: ", 43)
	data := readFile("in.txt")
	fmt.Println("part 1:", part1(data))
	fmt.Println("part 2:", part2(data))
}

func part1(g Grid) int {
	sum := 0
	g.Walk(&Point{0, 0}, func(p *Point) {
		if g.IsAccessibleByForklift(p) {
			sum++
		}
	})
	return sum
}

func part2(g Grid) int {
	sum := 0
	for {
		removed := 0
		g.Walk(&Point{0, 0}, func(p *Point) {
			if g.IsAccessibleByForklift(p) {
				g.RemoveRoll(p)
				sum++
				removed++
			}
		})
		if removed == 0 {
			break
		}
	}
	return sum
}

func readFile(filename string) Grid {
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
	out := [][]byte{}
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		out = append(out, []byte(strings.TrimSpace(scanner.Text())))
	}
	if err := scanner.Err(); err != nil {
		panic(fmt.Sprintf("error reading file %q: %v", path, err))
	}
	return Grid{out}
}
