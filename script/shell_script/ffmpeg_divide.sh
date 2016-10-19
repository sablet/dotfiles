#!/bin/bash

echo "" > /tmp/ffmpeg_log
initial=0
count=1
cat $2| awk '{print  $1 * 60 + $2}'|while read finish
do
	echo i:$initial f:$finish >> /tmp/ffmpeg_log
	echo $(($finish-$initial))
	initial=${finish}
	count=$((count+1))
done

# ffmpeg -ss $finish -i $1 -t 99999 -vcodec copy -acodec copy $(basename $1 .mp4)${count}.mp4 
