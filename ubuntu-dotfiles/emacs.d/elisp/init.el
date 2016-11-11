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


;load-path�ɲôؿ�
(defun add-to-load-path (&rest paths)
  (let (path)
    (dolist (path paths paths)
      (let ((default-directory
	      (expand-file-name (concat user-emacs-directory path))))
	(add-to-list 'load-path default-directory)
	(if (fboundp 'norma-top-level-add-subdirs-to-load-path)
	    (normal-top-level-add-subdirs-to-load-path))))))

;�����Υǥ��쥯�ȥ�Ȥ��Υ��֥ǥ��쥯�ȥ��load-path���ɲ�
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

;; GUI�ηٹ��ɽ�����ʤ�
(setq flymake-gui-warnings-enabled nil)

;; ���ƤΥե������ flymake��ͭ����
(add-hook 'find-file-hook 'flymake-find-file-hook)

;; M-p/M-n �Ƿٹ�/���顼�Ԥΰ�ư
(global-set-key "\M-p" 'flymake-goto-prev-error)
(global-set-key "\M-n" 'flymake-goto-next-error)

;; �ٹ𥨥顼�Ԥ�ɽ��
(global-set-key "\C-cd" 'flymake-display-err-menu-for-current-line)

;; auto-complete
(when (require 'auto-complete-config nil t)
  (add-to-list 'ac-dictionary-directories
			   "~/.emacs.d/elisp/ac-dict")
  (define-key ac-mode-map (kbd "M-TAB") 'auto-complete)
  (ac-config-default))

			   
;color-theme
(load-theme 'manoj-dark t) 

;backup,autosave����
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
   ;����ɽ������ default0.5
	anything-idle-delay 0.3
   ;�����׸�����̻��� default 0.1
   anything-inpute-idle-delay 0.2
   ;�������ɽ���� default50
   anything-candidate-number-limit 100
   ;����¿���Ȥ����δ����ָ���
   anything-quick-update t
   ;���򥷥硼�ȥ��åȥ���ե��٥å�
   anything-enable-shortcuts 'alphabet)

   (when (require 'anything-config nil t)
	 ;root���Υ��ޥ��
	 (setq anything-su-or-sudo "sudo"))

   (require 'anything-match-plugin nil t)

   (when (and (executable-find "cmigemo")
			  (require 'migemo nil t))
	 (require 'anything-migemo nil t))

   (when (require 'anything-complete nil t)
	 ;Lisp����ܥ��䴰����Ƹ�������
	 (anything-lisp-complete-symbol-set-timer 150))

   (require 'anything-show-completation nil t)

   (when (require 'auto-install nil t)
	 (require 'anything-auto-install nil t))

   (when (require 'descbinds-anything nil t)
	 ;describe-bindings��anything���֤�������
	 (descbinds-anything-install)))
				  
			  
;; color-moccur������
(when (require 'color-moccur nil t)
  ;; M-o��occur-by-moccur��������
  (define-key global-map (kbd "M-o") 'occur-by-moccur)
  ;; ���ڡ������ڤ��AND����
  (setq moccur-split-word t)
  ;; �ǥ��쥯�ȥ긡���ΤȤ���������ե�����
  (add-to-list 'dmoccur-exclusion-mask "\\.DS_Store")
  (add-to-list 'dmoccur-exclusion-mask "^#.+#$")
  ;; Migemo�����ѤǤ���Ķ��Ǥ����Migemo��Ȥ�
  (when (and (executable-find "cmigemo")
             (require 'migemo nil t))
    (setq moccur-use-migemo t)))

;; ���׳�ĥ��ǽ���󥹥ȡ��뢧
;;; P133-134 moccur�η�̤�ľ���Խ�����moccur-edit
;; moccur-edit������
(require 'moccur-edit nil t)
;; moccur-edit-finish-edit��Ʊ���˥ե��������¸����
;; (defadvice moccur-edit-change-file
;;   (after save-after-moccur-edit-buffer activate)
;;   (save-buffer))

;; ���׳�ĥ��ǽ���󥹥ȡ��뢧
;;; P136 grep�η�̤�ľ���Խ�����wgrep
;; wgrep������
(require 'wgrep nil t)


;; undohist������
(when (require 'undohist nil t)
  (undohist-initialize))

;; ���׳�ĥ��ǽ���󥹥ȡ��뢧
;;; P138 ����ɥ���ʬ�����򨡨�undo-tree
;; undo-tree������
(when (require 'undo-tree nil t)
  (global-undo-tree-mode))


;; ���׳�ĥ��ǽ���󥹥ȡ��뢧
;;; P139-140 ��������ΰ�ư���򨡨�point-undo
;; point-undo������
(when (require 'point-undo nil t)
  ;; (define-key global-map [f5] 'point-undo)
  ;; (define-key global-map [f6] 'point-redo)
  ;; ɮ�ԤΤ����ᥭ���Х����
  (define-key global-map (kbd "M-[") 'point-undo)
  (define-key global-map (kbd "M-]") 'point-redo)
  )

;; ���׳�ĥ��ǽ���󥹥ȡ��뢧
;;; P141-143 ������ɥ���ʬ����֤��������ElScreen
;; ElScreen�Υץ�ե��å����������ѹ�����ʽ���ͤ�C-z��
;; (setq elscreen-prefix-key (kbd "C-t"))
(when (require 'elscreen nil t)
  ;; C-z C-z�򥿥��פ������˥ǥե���Ȥ�C-z�����Ѥ���
  (if window-system
      (define-key elscreen-map (kbd "C-z") 'iconify-or-deiconify-frame)
    (define-key elscreen-map (kbd "C-z") 'suspend-emacs)))



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; 6.7 ��⡦��������                                     ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; ���׳�ĥ��ǽ���󥹥ȡ��뢧
;;;; P144-146 ���񤭡�ToDo��������howm
;;; howm�����¸�ξ��
;(setq howm-directory (concat user-emacs-directory "howm"))
;;; howm-menu�θ�������ܸ��
;(setq howm-menu-lang 'ja)
;;; howm����1��1�ե�����ˤ���
;; (setq howm-file-name-format "%Y/%m/%Y-%m-%d.howm")
;;; howm-mode���ɤ߹���
;(when (require 'howm-mode nil t)
;  ;; C-c,,��howm-menu��ư
;  (define-key global-map (kbd "C-c ,,") 'howm-menu))
;;; howm������¸��Ʊ�����Ĥ���
;(defun howm-save-buffer-and-kill ()
;  "howm������¸��Ʊ�����Ĥ��ޤ���"
;  (interactive)
;  (when (and (buffer-file-name)
;             (string-match "\\.howm" (buffer-file-name)))
;    (save-buffer)
;    (kill-buffer nil)))

;; C-c C-c�ǥ�����¸��Ʊ���˥Хåե����Ĥ���
;(define-key howm-mode-map (kbd "C-c C-c") 'howm-save-buffer-and-kill)

;anything-for-files kbd
(define-key global-map (kbd "C-x C-b") 'anything-for-files)

;cua-mode
(cua-mode t)
(setq cua-enable-cua-keys nil)


;;; P172 ruby-mode�Υ���ǥ�Ȥ�Ĵ������
;; ruby-mode�Υ���ǥ������
(setq ;; ruby-indent-level 3 ; ����ǥ������3�ˡ�����ͤ�2
      ruby-deep-indent-paren-style nil ; ���Ի��Υ���ǥ�Ȥ�Ĵ������
      ;; ruby-mode�¹Ի���indent-tabs-mode�������ͤ��ѹ�
      ;; ruby-indent-tabs-mode t ; ����ʸ������Ѥ��롣����ͤ�nil
      ) 

;; ���׳�ĥ��ǽ���󥹥ȡ��뢧
;;; P172-173 Ruby�Խ��Ѥ������ʥޥ��ʡ��⡼��
;; ��̤μ�ư��������ruby-electric
(require 'ruby-end nil t)
;; end���б�����ԤΥϥ��饤�Ȩ���ruby-block
(when (require 'ruby-block nil t)
  (setq ruby-block-highlight-toggle t))
;; ���󥿥饯�ƥ���Ruby�����Ѥ��먡��inf-ruby

(autoload 'run-ruby "inf-ruby"
  "Run an inferior Ruby process")
(autoload 'inf-ruby-keys "inf-ruby"
  "Set local key defs for inf-ruby in ruby-mode")

;; ruby-mode-hook�Ѥδؿ������
(defun ruby-mode-hooks ()
  (inf-ruby-keys)
  (ruby-end-mode t)
  (ruby-block-mode t))
;; ruby-mode-hook���ɲ�
(add-hook 'ruby-mode-hook 'ruby-mode-hooks)


(which-function-mode 1)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; 7.2 Flymake�ˤ��ʸˡ�����å�                          ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;; P182-183 Makefile����������Ѥ����ʤ����ľ�ܥ��ޥ�ɤ�¹Ԥ���
;;; Makefile�μ�������
;(defvar flymake-makefile-filenames
;  '("Makefile" "makefile" "GNUmakefile")
;  "File names for make.")
; 
;;; Makefile���ʤ���Х��ޥ�ɤ�ľ�����Ѥ��륳�ޥ�ɥ饤�������
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
;;; Flymake������ؿ�������
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
;;; ������ؿ������
;(defun flymake-simple-make-gcc-init ()
;  (message "%s" (flymake-simple-make-gcc-init-impl
;                 'flymake-create-temp-inplace t t "Makefile"
;                 'flymake-get-make-gcc-cmdline))
;  (flymake-simple-make-gcc-init-impl
;   'flymake-create-temp-inplace t t "Makefile"
;   'flymake-get-make-gcc-cmdline))
; 
;;; ��ĥ�� .c, .cpp, c++�ʤɤΤȤ��˾嵭�δؿ������Ѥ���
;; (add-to-list 'flymake-allowed-file-name-masks
;;              '("\\.\\(?:c\\(?:pp\\|xx\\|\\+\\+\\)?\\|CC\\)\\'"
;;                flymake-simple-make-gcc-init))
; 
;;;; P184 XML��HTML
;;; XML��Flymake������
;(defun flymake-xml-init ()
;  (list "xmllint" (list "--valid"
;                        (flymake-init-create-temp-buffer-copy
;                         'flymake-create-temp-inplace))))
; 
;;; HTML��Flymake������
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
;;; Ruby��Flymake������
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


;emacs-window���粽
;(set-frame-parameter nli 'fullscreen 'fullscreen)

;�������Ȳ�����ɽ��
(setq inhibit-startup-message t)

;�ġ���С���ɽ�� default:0
(tool-bar-mode 1)

;�ط�Ʃ��
(set-frame-parameter nil 'alpha '(100 100))

