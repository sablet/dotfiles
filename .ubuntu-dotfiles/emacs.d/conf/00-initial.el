;;defalut path: ~/emacs.d
(cd "~/Dropbox/.ubuntu-dotfiles")

;;menu,toolbar undisplay  default:0
(menu-bar-mode -1)
(tool-bar-mode -1)

;;スタート画面非表示
(setq inhibit-startup-message t)

;;タブインデント
(setq default-tab-width 2)

;;backup,autosave設定
(setq make-backup-files nil)
(setq auto-save-default nil)

;;音うるさいから消す
(setq visible-bell t)

;; Color
(if window-system (progn
    (set-frame-parameter (selected-frame) 'alpha 1.0)))

;;cua-mode
;;(cua-mode 1)

;;cuaきーばいんど無効
(setq cua-enable-cua-keys nil)

;;=の前後にすぺーす
(require 'electric-spacing)
(electric-spacing-mode t)

;;（）にハイライト表示
(show-paren-mode t)

;;表示を常に上下の真ん中の行にする
(require 'centered-cursor-mode)
(global-centered-cursor-mode t)

;; tramp(ssh接続)
;;(require 'tramp)
;;(setq tramp-default-method "ssh")

;;デフォルトでは折り返し表示
;;(toggle-truncate-lines t)
(global-set-key (kbd "C-c t") 'toggle-truncate-lines)


;;proxy設定
(unless (eq (string-to-char (shell-command-to-string "ifconfig|grep 10.236.105.255")) 0)
	(setq url-proxy-services
				'(("http" . "proxy.kuins.net:8080")
					("https" . "proxy.kuins.net:8080"))))
