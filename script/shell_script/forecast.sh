#!/bin/bash

: ${1:=■}
cd /tmp
fname=$(date +%y%m%d)forecast.html
wget -q -O - http://weather.yahoo.co.jp/weather/jp/26/6110.html > $fname 
weather=(`cat $fname|pup '.forecastCity'|pup img attr{alt}`)
high_temp=(`cat $fname|pup '.temp' |pup .high text{}|xargs echo|pcregrep -o '[+-]?\d{0,}'|xargs echo |awk '{print $1-$2,$1,$3}'`)
low_temp=(`cat $fname|pup '.temp' |pup .low text{}|xargs echo|pcregrep -o '[+-]?\d{0,}'|xargs echo |awk '{print $1-$2,$1,$3}'`)
for i in 1 2 3
do
		[ ${#high_temp[i]} = 1 ] && high_temp[i]='0'$high_temp[i]
		[ ${#low_temp[i]} = 1 ] && low_temp[i]='0'$low_temp[i]
done
echo "`date +%m`/`date +%d`の天気予報\n"
echo "京都市の天気\n今日:$weather[1] / 明日:$weather[2]\n"
echo "\n最高気温\n"
echo "昨日:$high_temp[1]:"$(color_echo red `rec_echo $1 $high_temp[1]`)
echo "今日:$high_temp[2]:"$(color_echo red `rec_echo $1 $high_temp[2]`)
echo "明日:$high_temp[3]:"$(color_echo red `rec_echo $1 $high_temp[3]`)
echo "\n最低気温\n"
echo "昨日:$low_temp[1]:"$(color_echo blue `rec_echo $1 $low_temp[1]`)
echo "今日:$low_temp[2]:"$(color_echo blue `rec_echo $1 $low_temp[2]`)
echo "明日:$low_temp[3]:"$(color_echo blue `rec_echo $1 $low_temp[3]`)
rm $fname
cd - > /dev/null
