alias la='ls -a'
alias ll='less'
alias l='ls -al'

alias rm='rm -rf'
alias cp='cp -ir'
alias mv='mv -i'
alias mkdir='mkdir -p'

alias adm_rm='sudo rm -rf .*'
alias shutdown='sudo shutdown -h now'
alias xdvi='xdvi -watchfile 1'
alias ping_test='ping -w 3 8.8.8.8'
alias 'chmod -R'='find -type f -print0 |xargs -0 chmod'
alias 'insert_file_multi'='cat <<"EOT" >>'
alias myip="ifconfig|pcregrep -o 'inet \d{1,3}\.\d{1,3}.\d{1,3}.\d{1,3}'|grep -v 127.0.0.1"
alias -g T='2>&1 | tee'
alias k2pdf_1column='k2pdfopt -n -w 1.0s -h 1.0s -om 1.5,0.25,1.5,0.25 -c -wrap- -fc- -col 2 -vls 1.4'
alias reset_sh='source ~/.zshrc'
alias sh_reset=reset_sh
alias date_summary='date "+%y%m%d"'
alias vir_python="source $HOME/anaconda3/bin/activate; ipython"
alias mytensor='source /home/nikke/virtualenvs/tensorflow-gpu/bin/activate'
alias pdflatex='ptex2pdf -u -l -ot "-synctex=1 -halt-on-error -interaction=nonstopmode -file-line-error" %O %S'


# go get github.com/yusukebe/revealgo/cmd/revealgo
slidestart(){
	$GOPATH/bin/revealgo $1 --transition none
}

function cat_jq(){cat $1|jq .;}


#to do require xsel
alias pbcopy='xsel --clipboard --input'
alias pbpaste='xsel --clipboard --output'

# グローバルエイリアス
alias -g L='| less'
alias -g G='| grep'

# C で標準出力をクリップボードにコピーする
# mollifier delta blog : http://mollifier.hatenablog.com/entry/20100317/p1
if which pbcopy >/dev/null 2>&1 ; then
    # Mac
    alias -g C='| pbcopy'
elif which xsel >/dev/null 2>&1 ; then
    # Linux
    alias -g C='| xsel --input --clipboard'
elif which putclip >/dev/null 2>&1 ; then
    # Cygwin
    alias -g C='| putclip'
fi

mk_mv (){mkdir $1; cd $1; }

function new(){cd ${1:-.};ls -lt|head;cd -;}

function github_open(){
	chromium-browser $(egrep -o 'https.*.git' "$1/.git/config") &
}
