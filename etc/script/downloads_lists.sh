#!/bin/bash

if [ $1 = '-h' ]
then
    echo please argument URL lists file
else
    cat $1|while read line
           do
               $HOME/anaconda3/bin/youtube-dl $line
           done
    echo FINISH!
