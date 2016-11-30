;syoki commandx 

;; Use inixinxt-loader.el
;; ref. https://github.com/emacs-jp/init-loader

;; Load downloaded init-loader.el
;; ref. http://tatsuyano.github.io/blog/2013/03/19/emacs-el-get-init-loader/

;; packages
(require 'package)
(add-to-list 'package-archives
			 '("melpa" . "http://melpa.milkbox.net/packages/"))
(add-to-list 'package-archives
			 '("marmalade" . "http://marmalade-repo.org/packages/"))
(add-to-list 'package-archives
			 '("ELPA" . "http://tromey.com/elpa/"))
(package-initialize)


;load-path追加関数
(defun add-to-load-path (&rest paths)
  (let (path)
    (dolist (path paths paths)
      (let ((default-directory
	      (expand-file-name (concat user-emacs-directory path))))
	(add-to-list 'load-path default-directory)
	(if (fboundp 'norma-top-level-add-subdirs-to-load-path)
	    (normal-top-level-add-subdirs-to-load-path))))))

;引数のディレクトリとそのサブディレクトリをload-pathに追加
(add-to-load-path "elisp" "conf" "public_repos")


(show-paren-mode t)
(setq load-path
  (append
  (list
  (expand-file-name "~/.emacs.d/")
  (expand-file-name "~/.emacs.d/init-loader/")
  )
  load-path))


;keybind
(global-set-key (kbd "C-m") 'newline-and-indent)
(define-key global-map (kbd "C-t") 'other-window)
(setq frame-title-format "%f")


;; Define directory of init files.
(require 'init-loader)
;(init-loader-load "~/.emacs.d/inits")
(setq default-tab-width 4)

;flymake
(require 'flymake)

;; GUIの警告は表示しない
(setq flymake-gui-warnings-enabled nil)

;; 全てのファイルで flymakeを有効化
(add-hook 'find-file-hook 'flymake-find-file-hook)

;; M-p/M-n で警告/エラー行の移動
(global-set-key "\M-p" 'flymake-goto-prev-error)
(global-set-key "\M-n" 'flymake-goto-next-error)

;; 警告エラー行の表示
(global-set-key "\C-cd" 'flymake-display-err-menu-for-current-line)

;; auto-complete
(when (require 'auto-complete-config nil t)
  (add-to-list 'ac-dictionary-directories
			   "~/.emacs.d/elisp/ac-dict")
  (define-key ac-mode-map (kbd "M-TAB") 'auto-complete)
  (ac-config-default))

			   
;color-theme
(load-theme 'manoj-dark t) 

;backup,autosave設定
(setq make-backup-files nil)
(setq auto-save-default nil)

;fook
(add-hook 'after-save-hock
		  'executable-make-buffer-file-executable-if-script-p)

(add-hook 'emacs-lisp-mode-hook
		  '(lambda ()
			 (when (require 'eldoc nil t)
			   (setq eldoc-idle-delay 0.2)
			   (setq eldoc-echo-area-use-multiline-p t)
			   (turn-on-eldoc-mode))))


;; kakutyoukinou

;auto-install
(when (require 'auto-install nil t)
  (setq auto-install-directory "~/.emacs.d/elisp/")
  (auto-install-update-emacswiki-package-name t)
  (auto-install-compatibility-setup))

;redo+
(when (require 'redo+ nil t)
  (global-set-key (kbd "C-.") 'redo))

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
				  
			  
;; color-moccurの設定
(when (require 'color-moccur nil t)
  ;; M-oにoccur-by-moccurを割り当て
  (define-key global-map (kbd "M-o") 'occur-by-moccur)
  ;; スペース区切りでAND検索
  (setq moccur-split-word t)
  ;; ディレクトリ検索のとき除外するファイル
  (add-to-list 'dmoccur-exclusion-mask "\\.DS_Store")
  (add-to-list 'dmoccur-exclusion-mask "^#.+#$")
  ;; Migemoを利用できる環境であればMigemoを使う
  (when (and (executable-find "cmigemo")
             (require 'migemo nil t))
    (setq moccur-use-migemo t)))

;; ▼要拡張機能インストール▼
;;; P133-134 moccurの結果を直接編集──moccur-edit
;; moccur-editの設定
(require 'moccur-edit nil t)
;; moccur-edit-finish-editと同時にファイルを保存する
;; (defadvice moccur-edit-change-file
;;   (after save-after-moccur-edit-buffer activate)
;;   (save-buffer))

;; ▼要拡張機能インストール▼
;;; P136 grepの結果を直接編集──wgrep
;; wgrepの設定
(require 'wgrep nil t)


;; undohistの設定
(when (require 'undohist nil t)
  (undohist-initialize))

;; ▼要拡張機能インストール▼
;;; P138 アンドゥの分岐履歴──undo-tree
;; undo-treeの設定
(when (require 'undo-tree nil t)
  (global-undo-tree-mode))


;; ▼要拡張機能インストール▼
;;; P139-140 カーソルの移動履歴──point-undo
;; point-undoの設定
(when (require 'point-undo nil t)
  ;; (define-key global-map [f5] 'point-undo)
  ;; (define-key global-map [f6] 'point-redo)
  ;; 筆者のお勧めキーバインド
  (define-key global-map (kbd "M-[") 'point-undo)
  (define-key global-map (kbd "M-]") 'point-redo)
  )

;; ▼要拡張機能インストール▼
;;; P141-143 ウィンドウの分割状態を管理──ElScreen
;; ElScreenのプレフィックスキーを変更する（初期値はC-z）
;; (setq elscreen-prefix-key (kbd "C-t"))
(when (require 'elscreen nil t)
  ;; C-z C-zをタイプした場合にデフォルトのC-zを利用する
  (if window-system
      (define-key elscreen-map (kbd "C-z") 'iconify-or-deiconify-frame)
    (define-key elscreen-map (kbd "C-z") 'suspend-emacs)))



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; 6.7 メモ・情報整理                                     ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; ▼要拡張機能インストール▼
;;;; P144-146 メモ書き・ToDo管理──howm
;;; howmメモ保存の場所
;(setq howm-directory (concat user-emacs-directory "howm"))
;;; howm-menuの言語を日本語に
;(setq howm-menu-lang 'ja)
;;; howmメモを1日1ファイルにする
;; (setq howm-file-name-format "%Y/%m/%Y-%m-%d.howm")
;;; howm-modeを読み込む
;(when (require 'howm-mode nil t)
;  ;; C-c,,でhowm-menuを起動
;  (define-key global-map (kbd "C-c ,,") 'howm-menu))
;;; howmメモを保存と同時に閉じる
;(defun howm-save-buffer-and-kill ()
;  "howmメモを保存と同時に閉じます。"
;  (interactive)
;  (when (and (buffer-file-name)
;             (string-match "\\.howm" (buffer-file-name)))
;    (save-buffer)
;    (kill-buffer nil)))

;; C-c C-cでメモの保存と同時にバッファを閉じる
;(define-key howm-mode-map (kbd "C-c C-c") 'howm-save-buffer-and-kill)

;anything-for-files kbd
(define-key global-map (kbd "C-x C-b") 'anything-for-files)

;cua-mode
(cua-mode t)
(setq cua-enable-cua-keys nil)


;;; P172 ruby-modeのインデントを調整する
;; ruby-modeのインデント設定
(setq ;; ruby-indent-level 3 ; インデント幅を3に。初期値は2
      ruby-deep-indent-paren-style nil ; 改行時のインデントを調整する
      ;; ruby-mode実行時にindent-tabs-modeを設定値に変更
      ;; ruby-indent-tabs-mode t ; タブ文字を使用する。初期値はnil
      ) 

;; ▼要拡張機能インストール▼
;;; P172-173 Ruby編集用の便利なマイナーモード
;; 括弧の自動挿入──ruby-electric
(require 'ruby-end nil t)
;; endに対応する行のハイライト──ruby-block
(when (require 'ruby-block nil t)
  (setq ruby-block-highlight-toggle t))
;; インタラクティブRubyを利用する──inf-ruby

(autoload 'run-ruby "inf-ruby"
  "Run an inferior Ruby process")
(autoload 'inf-ruby-keys "inf-ruby"
  "Set local key defs for inf-ruby in ruby-mode")

;; ruby-mode-hook用の関数を定義
(defun ruby-mode-hooks ()
  (inf-ruby-keys)
  (ruby-end-mode t)
  (ruby-block-mode t))
;; ruby-mode-hookに追加
(add-hook 'ruby-mode-hook 'ruby-mode-hooks)


(which-function-mode 1)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; 7.2 Flymakeによる文法チェック                          ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;; P182-183 Makefileがあれば利用し、なければ直接コマンドを実行する
;;; Makefileの種類を定義
;(defvar flymake-makefile-filenames
;  '("Makefile" "makefile" "GNUmakefile")
;  "File names for make.")
; 
;;; Makefileがなければコマンドを直接利用するコマンドラインを生成
;(defun flymake-get-make-gcc-cmdline (source base-dir)
;  (let (found)
;    (dolist (makefile flymake-makefile-filenames)
;      (if (file-readable-p (concat base-dir "/" makefile))
;          (setq found t)))
;    (if found
;        (list "make"
;              (list "-s"
;                    "-C"
;                    base-dir
;                    (concat "CHK_SOURCES=" source)
;                    "SYNTAX_CHECK_MODE=1"
;                    "check-syntax"))
;      (list (if (string= (file-name-extension source) "c") "gcc" "g++")
;            (list "-o"
;                  "/dev/null"
;                  "-fsyntax-only"
;                  "-Wall"
;                  source)))))
; 
;;; Flymake初期化関数の生成
;(defun flymake-simple-make-gcc-init-impl
;  (create-temp-f use-relative-base-dir
;                 use-relative-source build-file-name get-cmdline-f)
;  "Create syntax check command line for a directly checked source file.
;Use CREATE-TEMP-F for creating temp copy."
;  (let* ((args nil)
;         (source-file-name buffer-file-name)
;         (buildfile-dir (file-name-directory source-file-name)))
;    (if buildfile-dir
;        (let* ((temp-source-file-name
;                (flymake-init-create-temp-buffer-copy create-temp-f)))
;          (setq args
;                (flymake-get-syntax-check-program-args
;                 temp-source-file-name
;                 buildfile-dir
;                 use-relative-base-dir
;                 use-relative-source
;                 get-cmdline-f))))
;    args))
; 
;;; 初期化関数を定義
;(defun flymake-simple-make-gcc-init ()
;  (message "%s" (flymake-simple-make-gcc-init-impl
;                 'flymake-create-temp-inplace t t "Makefile"
;                 'flymake-get-make-gcc-cmdline))
;  (flymake-simple-make-gcc-init-impl
;   'flymake-create-temp-inplace t t "Makefile"
;   'flymake-get-make-gcc-cmdline))
; 
;;; 拡張子 .c, .cpp, c++などのときに上記の関数を利用する
;; (add-to-list 'flymake-allowed-file-name-masks
;;              '("\\.\\(?:c\\(?:pp\\|xx\\|\\+\\+\\)?\\|CC\\)\\'"
;;                flymake-simple-make-gcc-init))
; 
;;;; P184 XMLとHTML
;;; XML用Flymakeの設定
;(defun flymake-xml-init ()
;  (list "xmllint" (list "--valid"
;                        (flymake-init-create-temp-buffer-copy
;                         'flymake-create-temp-inplace))))
; 
;;; HTML用Flymakeの設定
;(defun flymake-html-init ()
;  (list "tidy" (list (flymake-init-create-temp-buffer-copy
;                      'flymake-create-temp-inplace))))
; 
;(add-to-list 'flymake-allowed-file-name-masks
;             '("\\.html\\'" flymake-html-init))
; 
;;; tidy error pattern
;(add-to-list 'flymake-err-line-patterns
;'("line \\([0-9]+\\) column \\([0-9]+\\) - \\(Warning\\|Error\\): \\(.*\\)"
;  nil 1 2 4))
; 
;;;; P186 Ruby
;;; Ruby用Flymakeの設定
;(defun flymake-ruby-init ()
;  (list "ruby" (list "-c" (flymake-init-create-temp-buffer-copy
;                           'flymake-create-temp-inplace))))
; 
;;(add-to-list 'flymake-allowed-file-name-masks
; ;            '("\\.rb\\'" flymake-ruby-init))
; 
;(add-to-list 'flymake-err-line-patterns
;             '("\\(.*\\):(\\([0-9]+\\)): \\(.*\\)" 1 2 nil 3))

;multi-term
(require 'multi-term)

(setq multi-term-program shell-file-name)

(global-set-key (kbd "C-c n") 'multi-term-next)
(global-set-key (kbd "C-c p") 'multi-term-prev)

(add-hook 'term-mode-hook
      (lambda ()
        (define-key term-raw-map (kbd "C-t") 'other-window)
        (define-key term-raw-map (kbd "C-y") 'term-paste)
        (define-key term-raw-map (kbd "C-h") 'term-send-backspace)
            (define-key term-raw-map (kbd "M-d") 'term-send-forward-kill-word)
            (define-key term-raw-map (kbd "M-<backspace>") 'term-send-backward-kill-word)
            (define-key term-raw-map (kbd "M-DEL") 'term-send-backward-kill-word)
            (define-key term-raw-map (kbd "C-v") nil)
        (define-key term-raw-map (kbd "ESC ESC") 'term-send-raw)
        (define-key term-raw-map (kbd "C-q") 'toggle-term-view)))

(defun toggle-term-view () (interactive)
  (cond ((eq major-mode 'term-mode)
     (fundamental-mode)
     (view-mode-enable)
     (local-set-key (kbd "C-c C-c") 'toggle-term-view)
     (setq multi-term-cursor-point (point)))
    ((eq major-mode 'fundamental-mode)
     (view-mode-disable)
     (goto-char multi-term-cursor-point)
     (multi-term-internal))))


;emacs-window最大化
;(set-frame-parameter nli 'fullscreen 'fullscreen)

;スタート画面非表示
(setq inhibit-startup-message t)

;ツールバー非表示 default:0
(tool-bar-mode 1)

;背景透過
(set-frame-parameter nil 'alpha '(100 100))

