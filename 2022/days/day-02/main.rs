const MOVES: &str = "ABCXYZ";
const MOVE_TO_LOSE_DRAW_WIN_STATE: [[u8; 3]; 3] = [[2, 0, 1], [0, 1, 2], [1, 2, 0]];
const STATES_SCORES: [u8; 3] = [0, 3, 6];

fn main() {
    let input: Vec<u8> = parse_input(&std::include_str!("./in.txt"));

    tests();

    println!("{}", part_1(&input));
    println!("{}", part_2(&input));
}

fn tests() {
    let input = "A Y
B X
C Z";
    {
        let expected = 15;
        let actual = part_1(&parse_input(&input));
        assert_eq!(expected, actual);
    }
    {
        let expected = 12;
        let actual = part_2(&parse_input(&input));
        assert_eq!(expected, actual);
    }
}

fn parse_input(input: &str) -> Vec<u8> {
    input
        .split("\n")
        .map(|round| round.split_whitespace())
        .map(|moves| moves.map(|m| MOVES.find(m).unwrap_or_default() % 3))
        .collect::<Vec<u8>>()
}

fn score_for_round(moves: &[u8; 2]) -> u8 {
    STATES_SCORES[MOVE_TO_LOSE_DRAW_WIN_STATE[moves[0]]
        .iter()
        .position(|&b_| b_ == moves[1])]
        + moves[1]
        + 1
}

fn deduce_moves(instruction: &[u8; 2]) -> [u8; 2] {
    [instruction[0], MOVE_TO_LOSE_DRAW_WIN_STATE[instruction[0]][instruction[1]]]
}

fn part_1(input: &Vec<u8>) -> u8 {
    input
        .iter()
        .map(|round| score_for_round(round))
        .sum();
}

fn part_2(input: &Vec<u8>) -> u8 {
    input
        .iter()
        .map(|instruction| deduce_moves(instruction))
        .map(|round| score_for_round(round))
        .sum();
}
