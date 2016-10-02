#!/bin/bash

cat <<EOF>> $HOME/.bashrc

source $HOME/git_dir/dotfiles/shell_config/alias.sh
source $HOME/git_dir/dotfiles/shell_config/variable.sh
source $HOME/git_dir/dotfiles/shell_config/color.sh
source $HOME/git_dir/dotfiles/shell_config/functions.sh
EOF

cat <<EOF |sudo tee -a /etc/bash.bashrc

source $HOME/git_dir/dotfiles/shell_config/alias.sh
source $HOME/git_dir/dotfiles/shell_config/variable.sh
source $HOME/git_dir/dotfiles/shell_config/color.sh
source $HOME/git_dir/dotfiles/shell_config/functions.sh
EOFb
