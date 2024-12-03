package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/urfave/cli/v3"
)

const (
	year      = 2024
	editor    = "code"
	inputFile = "in.txt"
	testOne   = "test.one.txt"
	testTwo   = "test.two.txt"
	daysPath  = "./days"
	apiURL    = "https://adventofcode.com"
)

var codeTemplate = `const fs = require('fs');

const parse = (source) => source.split('\n').filter(Boolean);

const data = parse(fs.readFileSync('in.txt', 'utf-8'));
const testOne = parse(fs.readFileSync('test.one.txt', 'utf-8'));
const testTwo = parse(fs.readFileSync('test.two.txt', 'utf-8'));

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.product = function () {
  return this.reduce((x, value) => x * value, 1);
};

const partOne = (data) => {};
const partTwo = (data) => {};

console.log('--- DATA---', data);
console.log('--- TEST PART ONE ---', partOne(testOne));
console.log('--- TEST PART TWO ---', partTwo(testTwo));
console.log('--- PART ONE ---', partOne(data));
console.log('--- PART TWO ---', partTwo(data));
`

func main() {
	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("Error loading .env file:", err)
		os.Exit(1)
	}

	cmd := &cli.Command{
		Name:  "AoC Tool",
		Usage: "Manage and run Advent of Code tasks",
		Commands: []*cli.Command{
			{
				Name:  "add",
				Usage: "Add a new day",
				Action: func(c context.Context, cmd *cli.Command) error {
					day := cmd.Args().First()
					if day == "" {
						return fmt.Errorf("day number required")
					}
					return createDay(day)
				},
			},
			{
				Name:  "run",
				Usage: "Run a specific day",
				Action: func(c context.Context, cmd *cli.Command) error {
					day := cmd.Args().First()
					if day == "" {
						return fmt.Errorf("day number required")
					}
					return runDay(day)
				},
			},
			{
				Name:  "list",
				Usage: "List all created days",
				Action: func(c context.Context, cmd *cli.Command) error {
					return listDays()
				},
			},
			{
				Name:  "stage",
				Usage: "Stage a specific day",
				Action: func(c context.Context, cmd *cli.Command) error {
					day := cmd.Args().First()
					if day == "" {
						return fmt.Errorf("day number required")
					}
					return stageDay(day)
				},
			},
		},
	}

	if err := cmd.Run(context.Background(), os.Args); err != nil {
		log.Fatal(err)
}
}

func createDay(day string) error {
	dayName := fmt.Sprintf("day-%02s", day)
	dayPath := filepath.Join(daysPath, dayName)
	filePath := filepath.Join(dayPath, "main.js")

	if _, err := os.Stat(filePath); err == nil {
		fmt.Printf("Day %s already exists. Overwrite? (yes/no): ", dayName)
		reader := bufio.NewReader(os.Stdin)
		response, _ := reader.ReadString('\n')
		if strings.TrimSpace(response) != "yes" {
			return nil
		}
	}

	os.MkdirAll(dayPath, os.ModePerm)

	err := os.WriteFile(filePath, []byte(codeTemplate), 0644)
	if err != nil {
		return fmt.Errorf("error creating file: %w", err)
	}

	fmt.Printf("Created day %s at %s\n", dayName, filePath)
	return nil
}

func runDay(day string) error {
	dayName := fmt.Sprintf("day-%02s", day)
	dayPath := filepath.Join(daysPath, dayName)
	cmd := exec.Command("node", filepath.Join(dayPath, "main.js"))
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func listDays() error {
	files, err := os.ReadDir(daysPath)
	if err != nil {
		return fmt.Errorf("error listing days: %w", err)
	}

	fmt.Println("Available days:")
	for _, file := range files {
		if file.IsDir() {
			fmt.Println(file.Name())
		}
	}
	return nil
}

func stageDay(day string) error {
	dayName := fmt.Sprintf("day-%02s", day)
	dayPath := filepath.Join(daysPath, dayName)

	emoji := getRandomXmasEmoji()
	cmd := exec.Command("git", "add", dayPath)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("error staging day: %w", err)
	}

	commitMessage := fmt.Sprintf("Add day %s of year %d %s", day, year, emoji)
	cmd = exec.Command("git", "commit", "-m", commitMessage)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func getRandomXmasEmoji() string {
	emojis := []string{"🎅", "🤶", "🎄", "❄️", "⛄", "🎁", "🔔", "🎶"}
	rand.Seed(time.Now().UnixNano())
	return emojis[rand.Intn(len(emojis))]
}
