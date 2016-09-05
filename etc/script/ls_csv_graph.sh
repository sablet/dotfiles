#!/bin/zsh

ls |grep csv| while read line
	 do
		 case $line in
			 *audusd* ) csv_to_histgram.py $line 12 118;;
			 *eurgbp* ) csv_to_histgram.py $line 12 164;;
			 *usdcad* ) csv_to_histgram.py $line 12 81;;
			 *eurchf* ) csv_to_histgram.py $line 12 116;;
			 *eurusd* ) csv_to_histgram.py $line 12 118;;
			 *cadjpy* ) csv_to_histgram.py $line 12;;
			 *usdchf* ) csv_to_histgram.py $line 12 116;;
			 *) echo $line "can't" process
		 esac
	 done
