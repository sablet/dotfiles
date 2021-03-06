#! /bin/sh

######################################################################
#
# SENDJPMAIL - Send A E-mail Which Has UTF-8 Characters
#
# USAGE: sendjpmail <mailfile>
#
# FORMAT OF MAILFILE:
#   Mailfile file has to conform the following rules:
#   * Header part is requires. ("Subject:", "From:", "To:", "Cc:"...)
#   * Body part is following the head part lines with a empty line.
#     |<header line #1>
#     |<header line #2>
#     |       :
#     |<header line #n>
#     |                     <- a empty line inserted here
#     |<body line #1>
#     |<body line #2>
#     |       :
#   * Do not contain 0x80-0xFF characters any header part lines except
#     "Subject:", "From:", "To:", "Cc:", "Bcc:" and "Reply-To:"
#   * If the following headers is omitted, inserted by this function.
#     "Content-Type:", "Content-Transfer-Encoding:", "MIME-Version:"
#
# Written by Rich Mikan (richmikan[at]richlab.org) at 2015/11/24
#
# This is a public-domain software. It measns that all of the people
# can use this with no restrictions at all. By the way, I am fed up
# the side effects which are broght about by the major licenses.
#
######################################################################

# print the usage and exit
print_usage_and_exit () {
  cat <<-__USAGE 1>&2
	Usage   : ${0##*/} <mailfile>
	Version : Tue Nov 24 23:21:11 JST 2015
	        : (POSIX.1 Bourne Shell/POSIX.1 commands/sendmail command/UTF-8)
__USAGE
  exit 1
}


# ===== FUNCTIONS ====================================================

# --- which command also works on Just a POSIX environment -----------
which which >/dev/null 2>&1 || {
  which () {
    (
      ans=$(LANG=C LC_ALL=C type "$1" 2>/dev/null) || return $?
      case "$1"   in */*) printf '%s\n' "$1"        ; return;; esac
      case "$ans" in */*) printf '%s\n' "/${ans#*/}"; return;; esac
      printf '%s\n' "$1"
    )
  }
}

# --- UTF-8 string cutter within required bytes ----------------------
cutstr_by_bytes () {
  awk -v maxbytes=$1 '
    BEGIN {
      OFS = ""; ORS = "";
      while (getline str) {
        bytes_thisline = 0;
        len = length(str);
        for (pos=1; pos<=len; pos+=bytes_a_letter) {
          c = substr(str, pos, 1);
          if      (c < "\200") {bytes_a_letter=1;}
          else if (c < "\300") {bytes_a_letter=1;} # invalid pattern!
          else if (c < "\340") {bytes_a_letter=2;}
          else if (c < "\360") {bytes_a_letter=3;}
          else if (c < "\370") {bytes_a_letter=4;}
          else if (c < "\374") {bytes_a_letter=5;}
          else if (c < "\376") {bytes_a_letter=6;}
          else                   {bytes_a_letter=1;} # invalid pattern!
          if (bytes_thisline+bytes_a_letter > maxbytes) {
            print "\n", substr(str, pos, bytes_a_letter);
            bytes_thisline  = bytes_a_letter;
          } else                               {
            print     substr(str, pos, bytes_a_letter);
            bytes_thisline += bytes_a_letter;
          }
        }
        print "\n";
      }
    }'
}

# --- prepare the required commands ----------------------------------
PATH='/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/sbin:/usr/local/bin'
CMD_SENDMAIL=$(which sendmail 2>/dev/null)
case "$CMD_SENDMAIL" in
  '') echo "${0##*/}: sendmail command is not found" 1>&2; exit 1;;
esac
PATH='/usr/bin:/bin:/usr/local/bin'
if   CMD_BASE64=$(which base64 2>/dev/null)      ; then
  base64 () { "$CMD_BASE64" ${1:-}; }
elif uuencode -m dummy </dev/null >/dev/null 2>&1; then
  CMD_UUENCODE=$(which uuencode 2>/dev/null)
  base64 () {
    w=''
    case "${1:-}" in
      --wrap=*) printf '%s\n' "$1" | grep -q '^--wrap=[0-9]\{1,\}$' && {
                  w=${1#--wrap=}
                }
                ;;
    esac
    case "$w" in '') w=76;; esac
    "$CMD_UUENCODE" -m dummy                     |
    sed '1d;$d'                                  |
    case $w in                                   #
      76) cat                                 ;; #
       0) tr -d '\n'                 ; echo '';; #
       *) tr -d '\n' | fold -w $width; echo '';; #
    esac
  }
else
  base64 () {
    w=''
    case "${1:-}" in
      --wrap=*) printf '%s\n' "$1" | grep -q '^--wrap=[0-9]\{1,\}$' && {
                  w=${1#--wrap=}
                }
                ;;
    esac
    case "$w" in '') w=76;; esac
    od -A n -t x1 -v                                                         |
    awk 'BEGIN{OFS=""; ORS="";                                               #
               x2o["0"]="0000"; x2o["1"]="0001"; x2o["2"]="0010";            #
               x2o["3"]="0011"; x2o["4"]="0100"; x2o["5"]="0101";            #
               x2o["6"]="0110"; x2o["7"]="0111"; x2o["8"]="1000";            #
               x2o["9"]="1001"; x2o["a"]="1010"; x2o["b"]="1011";            #
               x2o["c"]="1100"; x2o["d"]="1101"; x2o["e"]="1110";            #
               x2o["f"]="1111";                                              #
               x2o["A"]="1010"; x2o["B"]="1011"; x2o["C"]="1100";            #
               x2o["D"]="1101"; x2o["E"]="1110"; x2o["F"]="1111";         }  #
         {     l=length($0);                                                 #
               for(i=1;i<=l;i++){print x2o[substr($0,i,1)];}                 #
               printf("\n");                                              }' |
    awk 'BEGIN{s="";                                                      }  #
         {     buf=buf $0;                                                   #
               l=length(buf);                                                #
               if(l<6){next;}                                                #
               u=int(l/6)*6;                                                 #
               for(p=1;p<u;p+=6){print substr(buf,p,6);}                     #
               buf=substr(buf,p);                                         }  #
         END  {if(length(buf)>0){print substr(buf "00000",1,6);}          }' |
    awk 'BEGIN{ORS=""; w='$w';                                               #
               o2b6["000000"]="A"; o2b6["000001"]="B"; o2b6["000010"]="C";   #
               o2b6["000011"]="D"; o2b6["000100"]="E"; o2b6["000101"]="F";   #
               o2b6["000110"]="G"; o2b6["000111"]="H"; o2b6["001000"]="I";   #
               o2b6["001001"]="J"; o2b6["001010"]="K"; o2b6["001011"]="L";   #
               o2b6["001100"]="M"; o2b6["001101"]="N"; o2b6["001110"]="O";   #
               o2b6["001111"]="P"; o2b6["010000"]="Q"; o2b6["010001"]="R";   #
               o2b6["010010"]="S"; o2b6["010011"]="T"; o2b6["010100"]="U";   #
               o2b6["010101"]="V"; o2b6["010110"]="W"; o2b6["010111"]="X";   #
               o2b6["011000"]="Y"; o2b6["011001"]="Z"; o2b6["011010"]="a";   #
               o2b6["011011"]="b"; o2b6["011100"]="c"; o2b6["011101"]="d";   #
               o2b6["011110"]="e"; o2b6["011111"]="f"; o2b6["100000"]="g";   #
               o2b6["100001"]="h"; o2b6["100010"]="i"; o2b6["100011"]="j";   #
               o2b6["100100"]="k"; o2b6["100101"]="l"; o2b6["100110"]="m";   #
               o2b6["100111"]="n"; o2b6["101000"]="o"; o2b6["101001"]="p";   #
               o2b6["101010"]="q"; o2b6["101011"]="r"; o2b6["101100"]="s";   #
               o2b6["101101"]="t"; o2b6["101110"]="u"; o2b6["101111"]="v";   #
               o2b6["110000"]="w"; o2b6["110001"]="x"; o2b6["110010"]="y";   #
               o2b6["110011"]="z"; o2b6["110100"]="0"; o2b6["110101"]="1";   #
               o2b6["110110"]="2"; o2b6["110111"]="3"; o2b6["111000"]="4";   #
               o2b6["111001"]="5"; o2b6["111010"]="6"; o2b6["111011"]="7";   #
               o2b6["111100"]="8"; o2b6["111101"]="9"; o2b6["111110"]="+";   #
               o2b6["111111"]="/";                                           #
               if (getline) {print o2b6[$0];n=1;}                         }  #
         n==w {printf("\n")  ; n=0;                                       }  #
         {     print o2b6[$0]; n++;                                       }  #
         END  {if(NR>0){printf("%s\n",substr("===",1,(4-(NR%4))%4));}     }'
  }
fi


# ===== PREPARATION ==================================================

# --- misc setting ---------------------------------------------------
set -u
umask 0022
IFS=$(PATH=/usr/bin:/bin printf ' \t\n_'); IFS=${IFS%_}
export IFS LC_ALL=C LANG=C
export PATH='/usr/bin:/bin'
CR=$( printf '\r'   )
LF=$( printf '\\\n_'); LF=${LF%_}
ACK=$(printf '\006' )
NAK=$(printf '\025' )
TAB=$(printf '\t'   )


# ===== OPTION PARSING ===============================================

file=''
case $# in
     0) file='-'
        ;;
  [12]) [ \( -f "$1" \) -o \( -c "$1" \) -o \( -p "$1" \) -o \
          \( "_$1" = '_-' \)                              ] || {
          print_usage_and_exit
        }
        file=$1
        case "$file" in -|/*|./*|../*) :;; *) file="./$file";; esac
        ;;
        # supporting $#==2 is for compatibility with the previous version
        # even if given, ignored
     *) print_usage_and_exit
        ;;
esac


# ===== CONVERT AND SEND =============================================

ct=0   # be set to 1 if the mail text has "Content-Type:" header
ct_m=0 # be set to 1 if the mail text has "Content-Type: multipart/*" header
cte=0  # be set to 1 if the mail text has "Content-Transfer-Encoding:" header
mv=0   # be set to 1 if the mail text has "MIME-Version:" header
IFS='
'
mode=''
cat "$file"                                                                    |
while read -r line; do                                                         #
  case "$line" in                                                              #
    '')                                mode='endh'               ;;            #
    From:*|To:*|Cc:*|Bcc:*|Reply-To:*) mode='addr'               ;;            #
    Subject:*)                         mode='subj'               ;;            #
    "$TAB"*|' '*)                                                ;;            #
    Content-Type:*multipart/*)         mode='othr';  ct=1; ct_m=1;;            #
    Content-Type:*)                    mode='othr';  ct=1        ;;            #
    Content-Transfer-Encoding:*)       mode='othr'; cte=1        ;;            #
    MIME-Version:*)                    mode='othr';  mv=1        ;;            #
    *)                                 mode='othr'               ;;            #
  esac                                                                         #
  #                                                                            #
  case "$mode" in                                                              #
    # --- Subject header processing ----------------------------------         #
    'subj')                                                                    #
      # 0) check whether converting is required or not                         #
      printf '%s\n' "$line" | grep "^[${TAB} -~]\\{1,\\}\$" && continue        #
      # 1) print the label of the header (header name)                         #
      printf '%s' "$line"                          |                           #
      sed 's/^\([^'"$TAB"' ]*['"$TAB"' ]*\).*/\1/' |                           #
      tr -d '\n'                                                               #
      # 2) convert and print header of the after part                          #
      printf '%s' "$line"          |                                           #
      sed "s/^[^$TAB ]*[$TAB ]*//" |                                           #
      cutstr_by_bytes 42           |                                           #
      sed 's/^/_/'                 |                                           #
      sed 's/$/_/'                 |                                           #
      while read -r str; do        #                                           #
        printf '%s' "${str#_}" |   #                                           #
        sed 's/_$//'           |   #                                           #
        base64 --wrap=0        |   #                                           #
        grep '^'                   #                                           #
      done                         |                                           #
      sed 's/.*/=?UTF-8?B?&?=/'    |                                           #
      sed '1!s/^/'"$TAB"'/'                                                    #
      ;;                                                                       #
    # --- address header (From, To, Cc, Bcc, Reply-To) processing ----         #
    'addr')                                                                    #
      # 0) check whether converting is required or not                         #
      printf '%s\n' "$line" | grep "^[${TAB} -~]\\{1,\\}\$" && continue        #
      # 1) print the label of the header (header name)                         #
      printf '%s' "$line"                          |                           #
      sed 's/^\([^'"$TAB"' ]*['"$TAB"' ]*\).*/\1/' |                           #
      tr -d '\n'                                                               #
      # 2) convert and print header of the after part                          #
      firstloop1=1                                                             #
      printf '%s' "$line"                                        |             #
      sed "s/^[^$TAB ]*[$TAB ]*//"                               |             #
      sed "s/\"/$LF\"$LF/g"                                      |             #
      awk 'BEGIN{attr = "RAW:";                               }  #             #
           /^"/ {attr = (attr=="RAW:") ? "ESC:" : "RAW:";next;}  #             #
                {print attr $0;                               }' |             #
      sed "/^ESC:/s/,/$ACK/g"                                    |             #
      sed "/^ESC:/s/;/$NAK/g"                                    |             #
      sed 's/^....//'                                            |             #
      tr '\n' '"'                                                |             #
      sed 's/"$//'                                               |             #
      sed "s/\\([,;]\\)/\\1$LF/g"                                |             #
      sed 's/^['"$TAB"' ]\{1,\}//'                               |             #
      grep -v '^$'                                               |             #
      tr "$ACK$NAK" ',;'                                         |             #
      while read -r str1; do                                                   #
        case "$firstloop1" in 1) firstloop1=0;; 0) printf '\t';; esac          #
        printf '%s' "$str1" |                                                  #
        grep -E "^[$TAB ]*<?[!-?A-~]+@[A-Za-z0-9][A-Za-z0-9.-]+[A-Za-z0-9]>?[$TAB ]*,?[$TAB ]*$" &&
        continue                                                               #
        printf '%s' "$str1"                              |                     #
        sed "s/[$TAB ]*<\\{0,1\\}[!-?A-~]\\{1,\\}@[A-Za-z0-9][A-Za-z0-9.-]\\{1,\\}[A-Za-z0-9]>\\{0,1\\}[$TAB ]*,\\{0,1\\}[$TAB ]*\$//" |
        sed 's/^[^'"$TAB"' ]*"\(.*\)"[^'"$TAB"' ]*$/\1/' |                     #
        cutstr_by_bytes 30                               |                     #
        sed 's/^/_/'                                     |                     #
        sed 's/$/_/'                                     |                     #
        while read -r str2; do                           #                     #
          printf '%s' "${str2#_}" |                      #                     #
          sed 's/_$//'            |                      #                     #
          base64 --wrap=0         |                      #                     #
          grep ^                                         #                     #
        done                                             |                     #
        sed 's/.*/=?UTF-8?B?&?=/'                        |                     #
        sed '1!s/^/'"$TAB"'/'                            |                     #
        tr '\n' "$ACK"                                   |                     #
        sed "s/$ACK\$//"                                 |                     #
        tr -d '\n'                                       |                     #
        tr "$ACK" '\n'                                                         #
        printf '%s\n' "$str1" |                                                #
        sed "s/\\([$TAB ]*<\\{0,1\\}[!-?A-~]\\{1,\\}@[A-Za-z0-9][A-Za-z0-9.-]\\{1,\\}[A-Za-z0-9]>\\{0,1\\}[$TAB ]*,\\{0,1\\}[$TAB ]*\\)\$/$ACK\\1/" |
        sed "s/^.*$ACK//"                                                      #
      done                                                                     #
      ;;                                                                       #
    # --- another header processing ----------------------------------         #
    'othr')                                                                    #
				printf '%s\n' "$line"                                                    #
      ;;                                                                       #
    # --- routine after the end of the header part -------------------         #
    'endh')                                                                    #
      # 1) print headers which are printed yet                                 #
      case $ct  in                                                             #
        '0') echo 'Content-Type: text/plain;charset="UTF-8"';;                 #
      esac                                                                     #
      case "$((cte+ct_m))" in                                                  #
        '0') echo 'Content-Transfer-Encoding: base64'       ;;                 #
      esac                                                                     #
      case $mv  in                                                             #
        '0') echo 'MIME-Version: 1.0'                       ;;                 #
      esac                                                                     #
      # 2) print a blank line, which means a boundary between header and body  #
      echo                                                                     #
      # 3) print the body part                                                 #
      case "$((cte+ct_m))" in                                                  #
        0) cat                       | # For the mailbody text,                #
           sed "/^\$/s/\$/$CR/"      | # it must be always put <CR>            #
           sed "/[^$CR]\$/s/\$/$CR/" | # on the end of every line              #
           base64 --wrap=76         ;;                                         #
        *) cat                      ;;                                         #
      esac                                                                     #
      ;;                                                                       #
    # --- when a invalid header line is given ------------------------         #
    '')                                                                        #
      printf '%s\n' "${0##*/}: Invalid header part" 1>&2                       #
      cat >/dev/nulll                                                          #
      CMD_SENDMAIL=':'                                                         #
      ;;                                                                       #
  esac                                                                         #
done                                                                           |
"$CMD_SENDMAIL" -i -t
echo done
