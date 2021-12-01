DAY=$1

rimraf dist

if [[ -z $npm_config_day ]]; then
    echo \"No --day=NUMBER specified, so running all tests\"
    jest
else
    DAY_DIR_PATH=$(sh ./get_day_dirname.sh $DAY)
    jest $DAY_DIR_PATH
fi
