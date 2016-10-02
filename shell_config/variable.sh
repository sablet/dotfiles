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

cat ~/.address|grep university && {
		alias sudo='sudo -E'
		export http_proxy="http://proxy.kuins.net:8080"
		export https_proxy="https://proxy.kuins.net:8080"
		export ftp_proxy="http://proxy.kuins.net:8080"
		export ssh_proxy=$http_proxy
}
    
export browser='chromium-browser'

export PATH=$PATH:$HOME/git_dir/dotfiles/script/shell_script
export PATH=$PATH:$HOME/git_dir/dotfiles/script/python_script

cat .address|grep chromebook || {
    export PATH=$PATH:$HOME/anaconda3/bin
}

cat .address|grep chromebook && {
    export PATH=$PATH:$HOME/miniconda3/bin
}
# export PATH=/home/nikke/anaconda2/bin:$PATH
