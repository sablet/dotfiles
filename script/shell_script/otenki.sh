#!/bin/sh

cd /home/nikke/tmp/
fname=`date +%Y%m%d`_tenki.html
wget -q -O - http://www.tenki.jp/forecast/6/29/6110/26100-daily.html|tr -d '\n' > $fname
today_temp=`cat $fname|grep -Po '<td class="temp">.*?</td>'|grep -Po '\-?\d+'|tr -s '\n' , `
today_rain=`cat $fname|grep -Po '<tr class="rainProbability">.*?</tr>'|grep -Po '\-?\d+'|tr -s '\n' ,`
echo $today_temp >> temperature_log
echo $today_rain >> rain_log
notify-send `echo $today_temp|awk -F, '{print "気温"$1"/"$2}'` `echo $today_rain|awk -F, '{print "降水確率"$1":"$2":"$3":"$4}'` -t 0
	



