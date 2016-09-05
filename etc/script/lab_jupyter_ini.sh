#!/bin/zsh -i

cd $HOME/git_dir/bitbucket/ml/fx_esn/
source /home/nikke/virtualenvs/tensorflow-gpu/bin/activate
jupyter notebook
deactivate
