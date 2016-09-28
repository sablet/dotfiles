#!/bin/bash

str=$(zenity --entry --title メモ --text "tech.org"に追記したい文章を入力してください)
test -z $str || {
		case $1 in
				'-t') echo -e '** '"$(date +%y%m%d)\n$str" >> $HOME/Dropbox/memo/tech.org
						;;
		esac
}
