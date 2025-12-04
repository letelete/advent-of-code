package main

import (
	"testing"
)

func BenchmarkPart1(b *testing.B) {
	data := readFile("in.txt")
	for b.Loop() {
		part1(data)
	}
}

func BenchmarkPart2(b *testing.B) {
	data := readFile("in.txt")
	for b.Loop() {
		part2(data)
	}
}
