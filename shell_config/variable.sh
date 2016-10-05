export LANG=en_US.UTF_8
export LESS='-R'
export LESSOPEN='| /usr/share/source-highlight/src-hilite-lesspipe.sh %s'

# enable gtk path to input japanese by fcitx
export GTK_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
export QT_IM_MODULE=fcitx

lspci|grep GTX > /dev/null && {
    export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/cuda/lib64"
    export CUDA_HOME=/usr/local/cuda
}

cat ~/.address|grep university > /dev/null && {
		alias sudo='sudo -E'
		export http_proxy="http://proxy.kuins.net:8080"
		export https_proxy="https://proxy.kuins.net:8080"
		export ftp_proxy="http://proxy.kuins.net:8080"
		export ssh_proxy=$http_proxy
}
    
export browser='chromium-browser'

export DOT_DIR=$HOME/git_dir/dotfiles
export PATH=$PATH:$DOT_DIR/script/shell_script
export PATH=$PATH:$DOT_DIR/script/python_script
export GIT_MEMO=$DOT_DIR/etc/gitmemo
export APT_MEMO=$DOT_DIR/etc/aptmemo

grep chromebook $HOME/.address > /dev/null || {
    export PATH=$PATH:$HOME/anaconda3/bin
}

grep chromebook $HOME/.address > /dev/null && {
    export PATH=$PATH:$HOME/miniconda3/bin
}

export PATH="$PATH:$HOME/bin"
