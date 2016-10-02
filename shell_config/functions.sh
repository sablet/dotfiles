#!/bin/bash

# git sugar sintax
git() {
    case $1 in
        clone)
            /usr/bin/git clone $2 && grep $2 $GIT_MEMO || cat << EOT >> $GIT_MEMO

# $(date_summary)
git clone $2
EOT
        chmod 775 $GIT_MEMO ;;

        *) /usr/bin/git "$@"  ;;
    esac
}


apt-get() {
    [[ $@ =~ install ]] && {
        [[ $2 = "-y" ]] && grep $3 $APT_MEMO || {
            cat <<EOT>> $APT_MEMO
# $(date_summary)
sudo apt-get install -y $3
EOT
        }

        [[ $1 = install ]] && grep $2 $APT_MEMO || {
            cat <<EOF>> $APT_MEMO
# $(date_summary)
sudo apt-get install $2

EOF
        }
    }
    sudo /usr/bin/apt-get "$@" 
    chmod 775 $APT_MEMO
}
