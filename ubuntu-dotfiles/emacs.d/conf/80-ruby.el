
(setq ruby-indent-level 3 ; インデント幅を3に。初期値は2
      ruby-deep-indent-paren-style nil ; 改行時のインデントを調整する
      ruby-indent-tabs-mode t ; タブ文字を使用する。初期値はnil
      ) 

(require 'ruby-end nil t)
(when (require 'ruby-block nil t)
  (setq ruby-block-highlight-toggle t))

;;inf-ruby
(autoload 'run-ruby "inf-ruby")
(autoload 'inf-ruby-keys "inf-ruby")
 
;; ruby-mode-hook用の関数を定義
(defun ruby-mode-hooks ()
  (inf-ruby-keys)
  (electric-spacing-mode)
  (ruby-end-mode t)
  (ruby-block-mode t))
;; ruby-mode-hookに追加
(add-hook 'ruby-mode-hook 'ruby-mode-hooks)

;rdef
(require 'anything)
(require 'anything-rdefs)
(add-hook 'enh-ruby-mode-hook
          (lambda ()
            (define-key enh-ruby-mode (kbd "C-@") 'anything-rdefs)))

(require 'auto-highlight-symbol)
(require 'highlight-symbol)
(setq highlight-symbol-colors '("DarkOrange" "DodgerBlue1" "DeepPink1"))

(global-set-key (kbd "") 'highlight-symbol-at-point)
;(global-set-key (kbd "M-") 'highlight-symbol-remove-all)

;; smart-compile
(require 'smart-compile)
(define-key ruby-mode-map (kbd "C-c c") 'smart-compile)
(define-key ruby-mode-map (kbd "C-c C-c") (kbd "C-c c C-m"))

; robe
(autoload 'robe-mode "robe" "Code navigation, documentation lookup and completion for Ruby" t nil)
(autoload 'robe-ac-setup "robe-ac" "robe auto-complete" nil nil)
(add-hook 'robe-mode-hook 'robe-ac-setup)

;(require 'flycheck)
;(setq flycheck-check-syntax-automatically '(mode-enabled save))
;(add-hook 'ruby-mode-hook 'flycheck-mode)

