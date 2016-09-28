#!/bin/bash

ps_search redshift > /dev/null
if [ $? = 0 ]
then
		ps_kill_by_name redshift
else
		redshift-gtk
fi
