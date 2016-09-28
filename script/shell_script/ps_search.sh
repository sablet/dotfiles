: ${1:?}
if test -z $funcstack[2]
then
    ps ax|grep $1|grep -v grep|grep -v ${funcstack[1]}
else
    ps ax|grep $1|grep -v grep|grep -v ${funcstack[1]}|grep -v ${funcstack[2]}
fi
