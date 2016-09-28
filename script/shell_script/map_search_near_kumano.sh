#!/bin/bash

map_search_near_kumano(){
	keyword=`zenity --entry --text=調べたい場所を入力してください --title='GoogleMap'`
	$browser -new-tab "https://www.google.co.jp/maps/search/"${keyword}"/@35.0156122,135.7759939"
}
