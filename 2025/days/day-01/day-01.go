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

func mod(a, b int) int {
	return (a%b + b) % b
}

type Rotation struct {
	Dir      string
	Distance int
}

func (r Rotation) DirFactor() int {
	if r.Dir == "L" {
		return -1
	}
	return 1
}

type Dial struct {
	Value int
	Min   int
	Max   int
}

func (d *Dial) Rotate(r *Rotation) {
	d.Value = mod(d.Value+r.Distance*r.DirFactor(), (d.Max + 1))
}

func countDialCycles(d *Dial, r *Rotation) int {
	cycles := 0
	distance := r.Distance
	if r.Distance > d.Max+1 {
		cycles = int(math.Floor(float64(r.Distance) / float64(d.Max+1)))
		distance = r.Distance % (d.Max + 1)
	}
	dTemp := *d
	dTemp.Rotate(&Rotation{r.Dir, distance})
	if dTemp.Value == 0 || d.Value == 0 {
		return cycles
	}
	if (r.DirFactor() == -1 && dTemp.Value > d.Value) || (r.DirFactor() == 1 && dTemp.Value < d.Value) {
		return cycles + 1
	}
	return cycles
}

func main() {
	fmt.Println("[test case] part 1:", Part1(DeserializeInput(`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`)), ", expected: ", 3)
	fmt.Println("[test case] part 2:", Part2(DeserializeInput(`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`)), ", expected: ", 6)
	data := ReadFile("in.txt")
	fmt.Println("part 1:", Part1(data))
	fmt.Println("part 2:", Part2(data))
}


func Part1(data []Rotation) int {
	dial := Dial{Value: 50, Min: 0, Max: 99}
	zeroedTimes := 0
	for _, rotation := range data {
		dial.Rotate(&rotation)
		if dial.Value == 0 {
			zeroedTimes++
		}
	}
	return zeroedTimes
}

func Part2(data []Rotation) int {
	dial := Dial{Value: 50, Min: 0, Max: 99}
	cycles := 0
	for _, rotation := range data {
		cycles += countDialCycles(&dial, &rotation)
		dial.Rotate(&rotation)
	}
	return cycles + Part1(data)
}


func ReadFile(filename string) []Rotation {
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

	out := []Rotation{}
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}
		if next, err := DeserializeInstruction(line); err != nil {
			panic(fmt.Sprintf("cannot deserialize line %q: %v", line, err))
		} else {
			out = append(out, next)
		}
	}
	if err := scanner.Err(); err != nil {
		panic(fmt.Sprintf("error reading file %q: %v", path, err))
	}

	return out
}

func DeserializeInput(input string) []Rotation {
	lines := strings.Split(input, "\n")
	out := make([]Rotation, 0, len(lines))

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			panic("empty line in input")
		}
		if next, err := DeserializeInstruction(line); err != nil {
			panic(fmt.Sprintf("cannot deserialize line %q: %v", line, err))
		} else {
			out = append(out, next)
		}
	}
	return out
}

func DeserializeInstruction(instruction string) (Rotation, error) {
	dir := instruction[0:1]
	distance, err := strconv.Atoi(instruction[1:])
	if err != nil {
		return Rotation{}, fmt.Errorf("cannot convert distance in instruction %q: %v", instruction, err)
	}
	return Rotation{dir, distance}, nil
}