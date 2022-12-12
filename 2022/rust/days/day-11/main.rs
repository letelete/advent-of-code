type Input = i32;

fn main() {
    let input = parse_input(&std::include_str!(in.txt));

    tests();

    println!({}, part_1(&input));
    println!({}, part_2(&input));
}

fn tests() {
    let input = parse_input(&std::include_str!(test.txt));

    {
        let expected = 0;
        let actual = part_1(&parse_input(&input));
        assert_eq!(expected, actual);
    }
    {
        let expected = 0;
        let actual = part_2(&parse_input(&input));
        assert_eq!(expected, actual);
    }
}

fn parse_input(input: &str) -> Input {
    input
        .split(nn)
        .collect::<Vec<i32>>()
}
