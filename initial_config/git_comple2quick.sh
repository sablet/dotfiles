wget -O ~/git-completion.bash "http://git.kernel.org/?p=git/git.git;a=blob_plain;f=contrib/completion/git-completion.bash;h=893b7716cafa4811d237480a980140d308aa20dc;hb=01b97a4cb60723d18b437efdc474503d2a9dd384"
cat >>  ~/.zshrc
# git completion
autoload bashcompinit
bashcompinit
source ~/git-completion.bash
. ~/.zshrc
