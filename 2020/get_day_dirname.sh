DAY=$1
DAY_DIR_PATH="./src/days/day_"
(($DAY < 10)) && DAY_DIR_PATH+="0"
DAY_DIR_PATH+=$DAY
echo $DAY_DIR_PATH
