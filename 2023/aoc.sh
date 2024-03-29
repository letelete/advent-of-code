TEXT_AOC="$(tput rev)$(tput setaf 206)"
TEXT_INFO="$(tput bold)$(tput setaf 15)"
TEXT_INFO_SECONDARY="$(tput setaf 255)"
TEXT_ERROR="$(tput rev)$(tput setaf 196)"
TEXT_DEFAULT="$(tput sgr0)"

# --- BEGIN CONFIG ---
YEAR=2023
EDITOR="code"
INPUT_FILE="in.txt"
TEST_ONE_INPUT_FILE="test.one.txt"
TEST_TWO_INPUT_FILE="test.two.txt"

DAYS_PATH="./days"
API_URL="https://adventofcode.com"
# --- END CONFIG ---

# --- BEGIN TEMPLATE ---
CODE_TEMPLATE="""const fs = require('fs');

const parse = (source) => source.split('\\\n').filter(Boolean);

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

console.log('\\\x1b[31m--- DATA---\\\x1b[0m\\\n', data);
console.log('\\\x1b[31m--- TEST PART ONE ---\\\x1b[0m\\\n', partOne(testOne));
console.log('\\\x1b[31m--- TEST PART TWO ---\\\x1b[0m\\\n', partTwo(testTwo));
console.log();
console.log('\\\x1b[31m--- PART ONE ---\\\x1b[0m\\\n', partOne(data));
console.log('\\\x1b[31m--- PART TWO ---\\\x1b[0m\\\n', partTwo(data));
"""
# --- END TEMPLATE --

# $1 Formatter
# $2 Message
print() {
    echo "${TEXT_AOC}[aoc]${TEXT_DEFAULT} $1$2${TEXT_DEFAULT}"
}

# Returns pseudo-randomly generated christmass emoji. Don't ask questions. It's important, ok?
get_xmas_emoji() {
    EMOJIS=("👼" "🎅" "🤶" "🧑‍🎄" "🧝" "🧝‍♂️" "🧝‍♀️" "🦌" "🍪" "🥛" "🌟" "❄️" "⛄" "🎄" "🎁" "🔔" "🎶" "🕯️")
    EMOJIS_LEN=${#EMOJIS[@]}
    MAX_INDEX=$((EMOJIS_LEN - 1))
    RAND_INDEX="$(shuf -i 0-$MAX_INDEX -n 1)"
    echo "${EMOJIS[$RAND_INDEX]}"
}

# $1 Yes message
# $2 No message
# Returns "yes" if ($1) selected, "no" otherwise.
ask_yes_no() {
    select answer in "$1", "$2"; do
        case $answer in
        "$1,")
            echo "yes"
            break
            ;;
        "$2")
            echo "no"
            break
            ;;
        esac
    done
}

# $1 - aoc day number
get_day_name() {
    FILE_NAME="$(printf "day-%02d" $1)"
    echo $FILE_NAME
}

# $1 - aoc day number
get_day_path() {
    DAY_PATH="$DAYS_PATH/$(get_day_name $1)"
    echo $DAY_PATH
}

get_file_name() {
    FILE_NAME="main"
    echo $FILE_NAME
}

# $1 - aoc day number
get_file() {
    FILE="$(get_file_name).js"
    echo $FILE
}

# $1 - aoc day number
get_file_path() {
    FILE_PATH="$(get_day_path $1)/$(get_file $1)"
    echo $FILE_PATH
}

# $1 - aoc day number
get_input_path() {
    INPUT_PATH="$(get_day_path $1)/$INPUT_FILE"
    echo $INPUT_PATH
}

# $1 - aoc day number
get_test_one_path() {
    TEST_INPUT_PATH="$(get_day_path $1)/$TEST_ONE_INPUT_FILE"
    echo $TEST_INPUT_PATH
}

# $1 - aoc day number
get_test_two_path() {
    TEST_INPUT_PATH="$(get_day_path $1)/$TEST_TWO_INPUT_FILE"
    echo $TEST_INPUT_PATH
}

# Reads ENV variable AOC_SESSION_COOKIE
get_session_cookie() {
    echo "$AOC_SESSION_COOKIE"
}

help() {
    echo
    print $TEXT_INFO "Usage: [-r|--run <arg>] [-a|--add <arg>] [-c|--code <arg>] [-s|--stage <arg>] [-l|--list] [-h|--help]"
    OPTIONS=(
        "-r | --run   <DAY_NUMBER>           Executes given AoC day."
        "-a | --add   <DAY_NUMBER>           Adds a new AoC day."
        "-c | --code  <DAY_NUMBER>           Opens given AoC day in selected code editor (current: $EDITOR)."
        "-s | --stage <DAY_NUMBER>           Git commits given AoC day adding some christmass touch $(get_xmas_emoji)."
        "-l | --list                         Lists all created AoC days."
        "-h | --help                         Prints help page."
    )
    print $TEXT_INFO_SECONDARY "Options:"
    for ((i = 0; i < ${#OPTIONS[@]}; i++)); do
        print $TEXT_INFO_SECONDARY "${OPTIONS[$i]}"
    done
    echo
}

# $1 - aoc day number
ask_to_override() {
    DAY_NAME="$(get_day_name $1)"
    YES_MSG="Yes, override already existing day $DAY_NAME"
    NO_MSG="No, abort"
    case "$(ask_yes_no "$YES_MSG" "$NO_MSG")" in
    "yes")
        print $TEXT_INFO "Overriding day $DAY_NAME..."
        ;;
    "no")
        print $TEXT_INFO "Exiting..."
        exit 0
        ;;
    esac
}

# $1 - aoc day number
create_input_data() {
    ENDPOINT="$API_URL/$YEAR/day/$1/input"
    SESSION_COOKIE="$(get_session_cookie)"
    INPUT_PATH=$(get_input_path $1)
    TEST_ONE_INPUT_PATH=$(get_test_one_path $1)
    TEST_TWO_INPUT_PATH=$(get_test_two_path $1)

    echo "$(curl -s -H "Accept: application/json" --cookie "session=$(get_session_cookie)" $ENDPOINT)" >$INPUT_PATH
    touch $TEST_ONE_INPUT_PATH
    touch $TEST_TWO_INPUT_PATH
}

# $1 - aoc day number
create_day() {
    DAY_NAME="$(get_day_name $1)"
    FILE_PATH="$(get_file_path $1)"
    DAY_PATH="$(get_day_path $1)"

    if [ -f $FILE_PATH ]; then
        print $TEXT_ERROR "Day $DAY_NAME exists at $FILE_PATH. Override?"
        ask_to_override $1
    else
        print $TEXT_INFO "Creating a new day $DAY_NAME at $FILE_PATH"
        mkdir $DAY_PATH
    fi

    echo "$CODE_TEMPLATE" >$FILE_PATH
    create_input_data $1
}

#  $1 - aoc day number
run_day_in_dedicated_env() {
    FILE_NAME="$(get_file_name $1)"
    FILE="$(get_file $1)"
    DAY_PATH="$(get_day_path $1)"
    ROOT_PATH="$(pwd)"

    print $TEXT_INFO_SECONDARY 'Running with node...' && cd $DAY_PATH && node $FILE && cd $ROOT_PATH
}

# $1 - aoc day number
run_day() {
    FILE_PATH="$(get_file_path $1)"
    print $TEXT_INFO "Running day $(get_day_name $1) at $FILE_PATH"
    run_day_in_dedicated_env $1
}

list_days() {
    print $TEXT_INFO "Listing all created days:"
    for f in "$DAYS_PATH/*"; do
        print $TEXT_INFO_SECONDARY $f
    done
}

# $1 - aoc day number
code_day() {
    DAY_NAME="$(get_day_name $1)"
    DAY_PATH="$(get_day_path $1)"
    print $TEXT_INFO "Opening day $DAY_NAME in $EDITOR"
    echo "$($EDITOR $DAY_PATH)"
}

# $1 - aoc day number
stage_day() {
    DAY_NAME="$(get_day_name $1)"
    DAY_PATH="$(get_day_path $1)"
    print $TEXT_INFO "Commiting AoC day $DAY_NAME at $DAY_PATH"
    git add "$DAY_PATH" && git commit -m "Add day $1 of year $YEAR $(get_xmas_emoji)"
}

# --- begin options parsing ---
VALID_ARGS=$(getopt -a -n $0 -o hla:c:s:r: --long help,list,add:,code:,stage:,run: -- "$@")
if [[ $? -ne 0 ]]; then
    help
    exit 1
fi

eval set -- "$VALID_ARGS"
while [ : ]; do
    case "$1" in
    -h | --help)
        help
        exit
        ;;
    -l | --list)
        list_days
        exit
        ;;
    -a | --add)
        create_day $2
        shift 2
        ;;
    -c | --code)
        code_day $2
        shift 2
        ;;
    -s | --stage)
        stage_day $2
        shift 2
        ;;
    -r | --run)
        run_day $2
        shift 2
        ;;
    --)
        shift
        break
        ;;
    esac
done
# --- end options parsing ---
