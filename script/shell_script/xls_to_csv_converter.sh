#!/bin/sh

cd /home/nikke/fx_log/xls/
while :
do
	result=$(inotifywait -e CREATE .)
	dir=$(echo ${result} | awk -e '{print $1}')
    new_xls=$(echo ${result} | awk -e '{print $3}')
    action=$(echo ${result} | awk -e '{print $2}')
	new_csv=${new_xls%.*}.csv
	ssconvert $new_xls $new_csv
	mv $new_csv ../csv
done

