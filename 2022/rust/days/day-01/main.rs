use itertools::Itertools;

fn main() {
    let input: Vec<i32> = parse_input(&std::include_str!("./in.txt"));

    tests();

    println!("{}", part_1(&input));
    println!("{}", part_2(&input));
}

fn tests() {
    let input = "1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
";
    {
        let expected = 24000;
        let actual = part_1(&parse_input(&input));
        assert_eq!(expected, actual);
    }
    {
        let expected = 45000;
        let actual = part_2(&parse_input(&input));
        assert_eq!(expected, actual);
    }
}

fn parse_input(input: &str) -> Vec<i32> {
    input
        .split("\n\n")
        .map(|elf| elf.lines().map(|line| line.parse::<i32>().unwrap()).sum())
        .collect::<Vec<i32>>()
}

fn part_1(input: &Vec<i32>) -> i32 {
    return *input.iter().max().unwrap();
}

fn part_2(input: &Vec<i32>) -> i32 {
    input.clone().into_iter().sorted().collect::<Vec<i32>>()[input.len() - 3..]
        .iter()
        .sum()
}
