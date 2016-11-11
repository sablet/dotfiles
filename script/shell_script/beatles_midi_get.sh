#!/bin/bash

curl -s "http://www.midiworld.com/files/995/"|pup a attr{href}|grep download|while read url
do
	curl -s "$url" -O # -O means original file name reserve
	sleep 20
done
