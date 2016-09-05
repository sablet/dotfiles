apt-get update
apt-get dist-upgrade
apt-get install -y fcitx-mozc  --install-recommends
im-config -n fcitx
apt-get install -y  git chromium-browser zsh emacs kupfer 

chsh -s /usr/bin/zsh 
wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -
.dropbox-dist/dropboxd&

wget https://github.com/ericchiang/pup/releases/download/v0.3.9/pup_linux_amd64.zip
unzip pup_linux_amd64.zip
mv pup /usr/local/bin
rm pup_linux_amd64.zip

