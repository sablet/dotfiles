#!/usr/bin/gnuplot -persist

set datafile separator ","

set xdata time
set timefmt "%Y-%m-%d"
set format x "%y/%m"

plot '/home/nikke/download/table.csv' using 1:2
pause -1