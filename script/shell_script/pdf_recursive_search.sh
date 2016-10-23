#!/bin/bash

which pdftotext || {
	echo "want to install xpdf? (y or n)"
	read ans
	[[ $ans -ne y ]] && sudo apt-get install xpdf
}

[[ $# = 2 ]] || {
	echo please two argumets
	exit 1
}

dname=/tmp/$(basename $1)_archive
ls $dname > /dev/null || {
	mkdir -p $dname
	echo seraching...
	find $1 | egrep pdf|while read line 
	do 
		# echo $line
		pdftotext $line $dname/$(basename $line .pdf)
	done
	echo search done
}
ag "$2" $dname/*
