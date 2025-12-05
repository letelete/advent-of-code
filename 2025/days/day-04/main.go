package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gdamore/tcell/v2"
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

func (g *Grid) Walk(fn func(p *Point)) {
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
	visualize := flag.Bool("v", false, "run visualization instead :)")
	flag.Parse()

	data := readFile("in.txt")

	if *visualize {
		runVis(&data)
		return
	}

	testData := readFile("test.txt")
	fmt.Println("[test case] part 1:", part1(testData), ", expected: ", 13)
	fmt.Println("[test case] part 2:", part2(testData), ", expected: ", 43)
	fmt.Println("part 1:", part1(data))
	fmt.Println("part 2:", part2(data))

}

func part1(g Grid) int {
	sum := 0
	g.Walk(func(p *Point) {
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
		g.Walk(func(p *Point) {
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

func runVis(g *Grid) {
	draw := func(screen tcell.Screen, g [][]byte, removed, sum int, p *Point) {
		screen.Clear()
		for y, row := range g {
			for x, b := range row {
				screen.SetContent(x, y, rune(b), nil, tcell.StyleDefault)
			}
		}
		statsY := len(g) + 1

		writeLine := func(y int, text string) {
			for i, r := range text {
				screen.SetContent(i, y, r, nil, tcell.StyleDefault)
			}
		}

		writeLine(statsY+0, fmt.Sprintf("Removed this step: %d", removed))
		writeLine(statsY+1, fmt.Sprintf("Total removed:     %d", sum))

		if p != nil {
			writeLine(statsY+2, fmt.Sprintf("Current: (%d, %d)", p.row, p.col))
		}
		screen.Show()
	}

	screen, err := tcell.NewScreen()
	if err != nil {
		panic(err)
	}
	if err := screen.Init(); err != nil {
		panic(err)
	}
	defer screen.Fini()
	screen.HideCursor()

	sum := 0
	for {
		removed := 0
		g.Walk(func(p *Point) {
			if g.IsAccessibleByForklift(p) {
				g.RemoveRoll(p)
				sum++
				removed++
				draw(screen, g.data, removed, sum, p)
				time.Sleep(1000)
			}
		})
		if removed == 0 {
			break
		}
	}
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
