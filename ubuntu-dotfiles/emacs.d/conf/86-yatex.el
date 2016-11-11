;; yatex-mode の起動
(setq auto-mode-alist 
      (cons (cons "\.tex$" 'yatex-mode) auto-mode-alist))
(autoload 'yatex-mode "yatex" "Yet Another LaTeX mode" t)
 
;; 文章作成時の漢字コードの設定
;; 1 = Shift_JIS, 2 = ISO-2022-JP, 3 = EUC-JP, 4 = UTF-8
;; コードを指定してしまうと，別のコードのファイルも勝手に
;; ここで指定したコードに変換されてしまいトラブルのもとに
;; なるので，nilにしておくのが吉。
(setq YaTeX-kanji-code nil)
 
 
;LaTeXコマンドの設定
(setq tex-command "platex")
;YaTeXでのプレビューアコマンドを設定する
(setq dvi2-command "xdvi")
;AMS-LaTeX を使用すかどうか
(setq YaTeX-use-AMS-LaTeX t)
 
; RefTeXをYaTeXで使えるようにする
(add-hook 'yatex-mode-hook '(lambda () (reftex-mode t)))
; RefTeXで使うbibファイルの位置を指定する
;(setq reftex-default-bibliography '("~/Library/TeX/bib/papers.bib"))
 
;;RefTeXに関する設定
(setq reftex-enable-partial-scans t)
(setq reftex-save-parse-info t)
(setq reftex-use-multiple-selection-buffers t)
 
;;RefTeXにおいて数式の引用をqrefにする
(setq reftex-label-alist '((nil ?e nil "~\eqref{%s}" nil nil)))
 
; [prefix] 英字 コマンドを[prefix] C-英字 に変更する
(setq YaTeX-inihibit-prefix-letter t)
 
;; 自動改行を抑制する
;;(add-hook 'yatex-mode-hook'
;; 		  (lambda ()
;; 			(setq auto-fill-mode 1)
;; 			)
;; 		  )

;;whizzy-mode
;;(require 'whizzytex)

;;ドル記号を入力したときに直接入力に切り替える。
(define-key mozc-mode-map "$" 'YaTeX-insert-dollar-or-mozc-insert)
(defun YaTeX-insert-dollar-or-mozc-insert ()
  (interactive)
  (if (eq major-mode 'yatex-mode)
      (YaTeX-insert-dollar)
    (mozc-insert))
  (mozc-mode))

	 
