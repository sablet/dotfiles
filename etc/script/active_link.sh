#!/bin/sh

cd $HOME
mkdir -p old_dotfiles
distribution=$(uname -a)
case $distribution in
		*Ubuntu*) dname='.ubuntu-dotfiles' ;;
		*Arch*) dname='arch-dotfiles' ;;
esac
echo "dotfile name is $dname"

dotfiles=($(ls $HOME/Dropbox/$dname|tr '\n' ' '))
for lname in ${dotfiles[@]}
do
		rm -rf ".$lname"
	        #mv ".$ln	ame" old_dotfiles/$lname
		ln -s $HOME/Dropbox/$dname/$lname ".$lname"
done
