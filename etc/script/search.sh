#!/bin/bash

google_search4(){
	keyword=`zenity --entry --text=検索したいワードを入力してください --title='GoogleAPI'`
	wget -O - "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=`echo ${keyword}`"|jq '.responseData.results | .[].cacheUrl'|xargs firefox
}

map_search_near_kumano(){
	keyword=`zenity --entry --text=調べたい場所を入力してください --title='GoogleMap'`
	firefox -new-tab "https://www.google.co.jp/maps/search/"${keyword}"/@35.0156122,135.7759939"
}
#wget -O - "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q="${keyword}|jq '.responseData.results | .[].url'|xargs firefox > /dev/null 2>&1
