;;mozc読み込み /usr/share/emacs24/site-lisp/mozc.el
(require 'mozc)
(set-language-environment "Japanese")
(setq default-input-method "japanese-mozc")
 
;変換候補吊り下げ表示
(setq mozc-candidate-style 'overlay)
 
;; ターミナルから呼び出したときにターミナルに渡す文字コード
(set-terminal-coding-system 'utf-8-unix)
 
;; 新しく開いたファイルを保存しておくときの文字コード
(prefer-coding-system 'utf-8-unix)
 
;; emacsをXのアプリケーションへ貼り付けるときの文字コード
(set-clipboard-coding-system 'utf-8)
 
;;日本語入力時はカーソルの色を変える
;;(list-colors-display) ;色の一覧表示
 
;(setq mozc-color "orange red")
;(setq default-color "cyan")
(set-cursor-color "cyan")




	









