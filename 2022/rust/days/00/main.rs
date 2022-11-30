// A warm-up before the year 2022!
// https://adventofcode.com/2021/day/1

fn main() {
    let input: Vec<i32> = parse_input(&std::include_str!("./in.txt"));

    tests();

    println!("{}", solve(&input, 1));
    println!("{}", solve(&input, 3));
}

fn tests() {
    let input = "199
200
208
210
200
207
240
269
260
263";
    {
        let expected = 7;
        let actual = parse_input(&input);
        assert_eq!(expected, solve(&actual, 1))
    }
    {
        let expected = 5;
        let actual = parse_input(&input);
        assert_eq!(expected, solve(&actual, 3))
    }
}

fn parse_input(input: &str) -> Vec<i32> {
    input
        .lines()
        .map(|line| line.parse().unwrap())
        .collect::<Vec<i32>>()
}

fn solve(input: &Vec<i32>, window_width: usize) -> usize {
    input[window_width..]
        .iter()
        .enumerate()
        .filter(|&(i, val)| val > &input[i])
        .count()
}
