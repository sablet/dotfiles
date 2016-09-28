#!/bin/bash

cd /tmp
fname="$HOME/Dropbox/memo/time_log"
ini=$(date "+%y%m%d %H:%M")
task_name=$(/usr/bin/time 2>tmp_log zenity --entry --title ログ管理 --text 行ったタスクを英語で入力してください)
time=$(pcregrep -o '[\d{0,}:]?\d{1,2}(?=:\d{2})' tmp_log)
sumtime=$(hour2minutes -s $time)
echo $task_name $sumtime $ini
rm tmp_log
if [ -z $task_name ]
then
		cd -
		exit 1
elif ! [ $sumtime = "0" ]
then
		echo $task_name $sumtime $ini >> $fname 
		echo "書き出ししました" # デバッグ用
fi
cd -
