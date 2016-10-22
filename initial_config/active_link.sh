#!/bin/bash

cd $HOME
mkdir -p old_dotfiles

dotdir=$HOME/git_dir/dotfiles/ubuntu-dotfiles
dotfiles=($(ls $dotdir|tr '\n' ' '))
for lname in ${dotfiles[@]}
do
		rm -rf "$HOME/.$lname"
		ln -s $dotdir/$lname ".$lname"
done


# distribution=$(uname -a)
# case $distribution in
#		*Ubuntu*) dname='.ubuntu-dotfiles' ;;
#		*Arch*) dname='arch-dotfiles' ;;
# esac
# echo "dotfile name is $dname"
# dotfiles=($(ls $HOME/Dropbox/$dname|tr '\n' ' '))
