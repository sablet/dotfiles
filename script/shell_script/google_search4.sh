#!/bin/bash

google_search4(){
	keyword=`zenity --entry --text=検索したいワードを入力してください --title='GoogleAPI'`
	wget -O - "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=`echo ${keyword}`"|jq '.responseData.results | .[].cacheUrl'|xargs $browser
}
