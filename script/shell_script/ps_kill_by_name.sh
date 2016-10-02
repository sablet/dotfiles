: ${1:?}
ps_search.sh $1
if [ $? = 1 ]
then
    	echo "process $1 does not running"
else
	ps_search.sh $1| awk '{print $1}'|xargs kill
fi
