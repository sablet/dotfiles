#!/bin/bash

# git sugar sintax
function g() {
    # help colored
    [[ $@ =~ --help ]] && {
        color_less_env
        git "${@/--help}" --help
    }

    case $1 in
        c)
            git clone $2 && grep $2 $GIT_MEMO || cat << EOT >> $GIT_MEMO
# $(date_summary)
git clone $2
EOT
            ;;
        a) git add ${@/add} ;;
        c) git commit ${@/commit} ;;
        *) git $@ ;;
    esac
}

#function apt_install() {
#    sudo apt-get install -y 
