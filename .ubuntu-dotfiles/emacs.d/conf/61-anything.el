;anything
(when (require 'anything nil t)
   (setq
   ;候補表示時間 default0.5
	anything-idle-delay 0.3
   ;タイプ後再描写時間 default 0.1
   anything-inpute-idle-delay 0.2
   ;候補最大表示数 default50
   anything-candidate-number-limit 100
   ;候補多いときの体感時間向上
   anything-quick-update t
   ;選択ショートカットアルファベット
   anything-enable-shortcuts 'alphabet)

   (when (require 'anything-config nil t)
	 ;root時のコマンド
	 (setq anything-su-or-sudo "sudo"))

   (require 'anything-match-plugin nil t)

   (when (and (executable-find "cmigemo")
			  (require 'migemo nil t))
	 (require 'anything-migemo nil t))

   (when (require 'anything-complete nil t)
	 ;Lispシンボル補完候補再検索時間
	 (anything-lisp-complete-symbol-set-timer 150))

   (require 'anything-show-completation nil t)

   (when (require 'auto-install nil t)
	 (require 'anything-auto-install nil t))

   (when (require 'descbinds-anything nil t)
	 ;describe-bindingsをanythingに置き換える
	 (descbinds-anything-install)))

;anything-for-files kbd
(define-key global-map (kbd "C-x C-b") 'anything-for-files)

