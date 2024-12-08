#!/usr/bin/env bash

TEXT_AOC="$(tput rev)$(tput setaf 206)"
TEXT_INFO="$(tput bold)$(tput setaf 15)"
TEXT_INFO_SECONDARY="$(tput setaf 255)"
TEXT_ERROR="$(tput rev)$(tput setaf 196)"
TEXT_DEFAULT="$(tput sgr0)"

print() {
    echo "${TEXT_AOC}[aoc]${TEXT_DEFAULT} $1$2${TEXT_DEFAULT}"
}

get_xmas_emoji() {
    local emojis=("🎅" "🤶" "🧑‍🎄" "👼" "🧝" "🧝‍♂️" "🧝‍♀️" "🦌" "🎄" "🌟" "❄️" "⛄" "🎁" "🔔" "🎶" "🕯️" "🍪" "🥛" "🎂" "🧦" "🎉")
    echo "${emojis[RANDOM % ${#emojis[@]}]}"
}

ask_yes_no() {
    select answer in "$1" "$2"; do
        case $answer in
        "$1") echo "yes"; break ;;
        "$2") echo "no"; break ;;
        esac
    done
}

get_day_name() { printf "day-%02d" "$1"; }
get_day_path() { echo "$AOC_DAYS_PATH/$(get_day_name "$1")"; }
get_file_path() { echo "$(get_day_path "$1")/$AOC_DAY_TARGET_FILE"; }
get_input_path() { echo "$(get_day_path "$1")/$AOC_INPUT_FILE"; }
get_sample_input_path() { echo "$(get_day_path "$1")/$AOC_SAMPLE_INPUT_FILE"; }

help() {
    print $TEXT_INFO "Usage: [-r|--run <arg>] [-a|--add <arg>] [-c|--code <arg>] [-s|--stage <arg>] [-l|--list] [-h|--help]"
    local options=(
        "-r | --run   <DAY_NUMBER>           Executes given AoC day."
        "-a | --add   <DAY_NUMBER>           Adds a new AoC day."
        "-c | --code  <DAY_NUMBER>           Opens given AoC day in $AOC_EDITOR."
        "-s | --stage <DAY_NUMBER>           Git commits given AoC day adding some christmas touch $(get_xmas_emoji)."
        "-l | --list                         Lists all created AoC days."
        "-h | --help                         Prints help page."
    )
    print $TEXT_INFO_SECONDARY "Options:"
    for option in "${options[@]}"; do
        print $TEXT_INFO_SECONDARY "$option"
    done
}

ask_to_override() {
    local day_name=$(get_day_name "$1")
    local yes_msg="Yes, override already existing day $day_name"
    local no_msg="No, abort"
    case "$(ask_yes_no "$yes_msg" "$no_msg")" in
    "yes") print $TEXT_INFO "Overriding day $day_name..." ;;
    "no") print $TEXT_INFO "Exiting..."; exit 0 ;;
    esac
}

create_day() {
    local day_name=$(get_day_name "$1")
    local file_path=$(get_file_path "$1")
    local day_path=$(get_day_path "$1")

    if [ -f "$file_path" ]; then
        print $TEXT_ERROR "Day $day_name exists at $file_path. Override?"
        ask_to_override "$1"
    else
        print $TEXT_INFO "Creating a new day $day_name at $file_path"
        mkdir -p "$day_path"
    fi

    cp -r "$AOC_TEMPLATE_DIR/" "$day_path"
    create_input_data "$1"
}

create_input_data() {
    local day_endpoint="$AOC_API_URL/$AOC_YEAR/day/$1"
    local day_input_endpoint="$day_endpoint/input"
    local session_cookie="$AOC_SESSION_COOKIE"
    local input_path=$(get_input_path "$1")
    local sample_input_path=$(get_sample_input_path "$1")

    curl -s -H "Accept: application/json" --cookie "session=$session_cookie" $day_input_endpoint >$input_path
    touch $sample_input_path
}

run_day() {
    local day_path=$(get_day_path "$1")
    print $TEXT_INFO "Running day $(get_day_name "$1") at $day_path"
    node "$AOC_RUNNER_PATH" "$day_path" "$AOC_DAY_TARGET_FILE"
}

list_days() {
    print $TEXT_INFO "Listing all created days:"
    for day in "$AOC_DAYS_PATH"/*; do
        [ -d "$day" ] && print $TEXT_INFO_SECONDARY "$(basename "$day")"
    done
}

open_day_in_editor() {
    local day_path=$(get_day_path "$1")
    print $TEXT_INFO "Opening $(get_day_name "$1") in $AOC_EDITOR"
    "$AOC_EDITOR" "$day_path"
}

stage_day() {
    local day_path=$(get_day_path "$1")
    print $TEXT_INFO "Committing $(get_day_name "$1")"
    git add "$day_path" && git commit -m "Add day $1 of year $AOC_YEAR $(get_xmas_emoji)"
}

init_env() {
    if [ ! -f ".env" ]; then
        print "$TEXT_INFO" ".env file does not exist. Creating from .env.sample"
        cp ".env.sample" ".env" || {
            print "$TEXT_ERROR" "Failed to create .env file from .env.sample"
            return 1
        }
    fi

    set -a
    source "./.env" || {
        print "$TEXT_ERROR" "Failed to load .env file."
        return 1
    }
    set +a

    REQUIRED_VARS=("AOC_SESSION_COOKIE" "AOC_API_URL" "AOC_EDITOR" "AOC_YEAR" "AOC_INPUT_FILE" "AOC_SAMPLE_INPUT_FILE" "AOC_TEMPLATE_DIR" "AOC_DAYS_PATH" "AOC_RUNNER_PATH" "AOC_DAY_TARGET_FILE")
    for var in "${REQUIRED_VARS[@]}"; do
        if [ -z "${!var}" ]; then
            print "$TEXT_ERROR" "Environment variable $var is not set in .env"
            return 1
        fi
    done

    return 0
}

if ! init_env; then
    print "$TEXT_ERROR" "Environment setup failed. Exiting..."
    exit 1
fi

VALID_ARGS=$(getopt -a -n $0 -o hla:c:s:r: --long help,list,add:,code:,stage:,run: -- "$@")
if [ $? -ne 0 ]; then help; exit 1; fi

eval set -- "$VALID_ARGS"
while :; do
    case "$1" in
    -h | --help) help; exit ;;
    -l | --list) list_days; exit ;;
    -a | --add) create_day "$2"; shift 2 ;;
    -c | --code) open_day_in_editor "$2"; shift 2 ;;
    -s | --stage) stage_day "$2"; shift 2 ;;
    -r | --run) run_day "$2"; shift 2 ;;
    --) shift; break ;;
    *) help; exit 1 ;;
    esac
done
