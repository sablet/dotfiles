#!/bin/bash

: ${2:?}
hour=$(echo $2|pcregrep -o '\d{1,2}(?=:\d\d)')
: ${hour:=0}
min=$(echo ${2#$hour:})
case $1 in
		'-h') echo $hour
				;;
		'-m') echo $min
				;;
		'-s') expr $hour \* 60 + $min
				;;
		'*') echo "please -h,-s,-s"
				;;
esac
}
