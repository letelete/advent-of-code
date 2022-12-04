use std::cmp;

struct Segment(i32, i32);

fn main() {
    let input: Vec<[Segment; 2]> = parse_input(&std::include_str!("./in.txt"));

    tests();

    println!("{}", part_1(&input));
    println!("{}", part_2(&input));
}

fn tests() {
    let input = "2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8";
    {
        let expected = 2;
        let actual = part_1(&parse_input(&input));
        assert_eq!(expected, actual);
    }
    {
        let expected = 4;
        let actual = part_2(&parse_input(&input));
        assert_eq!(expected, actual);
    }
}

fn parse_input(input: &str) -> Vec<[Segment; 2]> {
    input
        .split("\n")
        .map(|line| line.split(","))
        .map(|pairs| {
            pairs.map(|p| {
                let [start, end] = p.split("-").map(|value| value.parse().unwrap());
                let segment = Segment(start, end);
                segment
            })
        })
        .collect::<Vec<[Segment; 2]>>()
}

fn segments_include([(a_begin, a_end), (b_begin, b_end)]: &[Segment; 2]) -> bool {
    a_begin >= b_begin && a_end <= b_end
}

fn segments_intersect([(a_begin, a_end), (b_begin, b_end)]: &[Segment; 2]) -> bool {
    a_end >= b_begin && b_end >= a_begin
}

fn part_1(input: &Vec<[Segment; 2]>) -> i32 {
    input
        .iter()
        .filter(|[a, b]| segments_include(&[a, b]) || segments_include(&[b, a]))
        .len()
}

fn part_2(input: &Vec<[Segment; 2]>) -> i32 {
    input
        .iter()
        .filter(|[a, b]| segments_intersect(&[a, b]) || segments_intersect(&[b, a]))
        .len()
}
