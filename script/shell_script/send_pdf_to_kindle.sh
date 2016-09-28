zenity --file-selection --multiple|tr '|' '\n'|while read fname
do
		k2pdfopt $fname -dev 5 -ui- -x -fs 10 > /dev/null
		fname=`dirname $fname`/`basename $fname .pdf`_k2opt.pdf
		gmail_for_paperwhite.py $fname
		[ $? = 0 ] | rm $fname
done
