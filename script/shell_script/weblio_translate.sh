#!/bin/bash

word=$(zenity --entry --title 英和翻訳 --text 英語を入力してください)
test $? = 0 && {
		centence=$(wget -q -O - "http://ejje.weblio.jp/content/$word" | pup .summaryM text{})
		if test -z $centence
		then
				echo "\nお探しの単語[ $word ]は見つかりませんでした" |zenity --text-info
		else
				meaning=$(echo $centence|grep -1 "主な意味")
				pronounciation=$(echo $centence|grep -1 "米国英語"|head -2)
				echo -e "$meaning\n\n発音記号$pronounciation"| zenity --text-info
				echo -e "$meaning\n発音記号\n$pronounciation\n" |grep -v 米国英語 >> ~/Dropbox/memo/weblio_log
		fi
}
