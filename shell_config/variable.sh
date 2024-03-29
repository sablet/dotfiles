export LANG=en_US.UTF_8
export LESS='-R'
export LESSOPEN='| /usr/share/source-highlight/src-hilite-lesspipe.sh %s'

# enable gtk path to input japanese by fcitx
export GTK_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
export QT_IM_MODULE=fcitx

#[[ lspci ]] && lspci  | [ grep GTX ]] && {
#    export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/cuda/lib64"
#    export CUDA_HOME=/usr/local/cuda
#}

    
export browser='chromium-browser'

export DOT_DIR=$HOME/git_dir/dotfiles
export PATH=$PATH:$DOT_DIR/script/shell_script
export PATH=$PATH:$DOT_DIR/script/python_script
export GIT_MEMO=$DOT_DIR/etc/gitmemo
export APT_MEMO=$DOT_DIR/etc/aptmemo

# ruby class config
export RUBYLIB=$HOME/ruby-class/lib

export GOPATH=$HOME/gopath
mkdir $GOPATH

export dotfiles=$HOME/git_dir/dotfiles
