git config --global user.name "sablet"
git config --global user.email "e.typ719@gmail.com"
git config --global color.ui auto

git config --global http.proxy $http_proxy
git config --global https.proxy $https_proxy



cat << "EOT" >> $HOME/.ssh/config
Host github.com
  User git
  HostName ssh.github.com
  Port 443
  ProxyCommand connect -H $http_proxy %h %p

Host bitbucket.org
  User git
  HostName altssh.bitbucket.org
  Port 443
  ProxyCommand connect -H $http_proxy %h %p
EOT

which connect && ssh -T git@github.com
