#!/bin/sh

cd /tmp
sudo -E apt-get build-dev -y emacs24
sudo -E apt-get install -y automake autoconf
wget http://ftp.jaist.ac.jp/pub/GNU/emacs/emacs-24.4.tar.gz
tar -xf emacs-24.4.tar.gz
cd emacs-24.4/
./configure
make bootstrap
sudo make install
