#!/bin/bash
#sh can't color 

if [[ $1 = 'help' ]]
then
		cat <<"EOF"
this program was deployed on 2016/01/31
this programs reloads if tex's file modify
and open evince

caution!
require apt_install inotify-tools

$1: filename
$2: if bemaer, don't pbibtex  
EOF
		exit 1
fi

name=$(basename ${1%%.*})
cd $(dirname $1)

ps ax|grep evince|grep -v grep || evince $name.pdf &
while inotifywait -e modify *.tex
do 
  log=$(platex -halt-on-error $name)
  if [ $? = 0 ]
  then
			platex $name > /dev/null
			if ! [[ $2 = 'beamer' ]]
			then
					pbibtex $name > /dev/null
					platex $name > /dev/null
			fi
			platex $name > /dev/null
			dvipdfmx $name > /dev/null
			ps ax|grep evince|grep -v grep || evince $name.pdf &
			rm *.aux *.bbl *.fls *.log *.toc *.blg *.out *.nav *.snm > /dev/null 2>&1 
	else
			echo -e "$log"
  fi
done

exit 1
