;; wgrepの設定
(require 'wgrep nil t)

;; undohistの設定
(when (require 'undohist nil t)
  (undohist-initialize))

;; undo-treeの設定
(when (require 'undo-tree nil t)
  (global-undo-tree-mode))

;elscleen,persist
(global-unset-key (kbd "C-z"))
(when (require 'elscreen nil t)
  (elscreen-start)
  (global-set-key [C-tab] 'elscreen-next)
  (require 'elscreen-persist)
  (elscreen-persist-mode 1))



;;redo+
(when (require 'redo+ nil t)
;;  (global-set-key (kbd "M-[") 'redo)
;;  (global-set-key (kbd "M-]") 'undo))
  (global-set-key (kbd "C-/") 'undo)
  (global-set-key (kbd "C-.") 'redo))

;;置換ショートカット
(global-set-key (kbd "M-r") 'replace-regexp)

;;insert防止
(global-set-key [insert] 'backward-delete-char-untabify)

;line表示key-bind
;(global-set-key (kbd "M-l") 'global-linum-mode)
(global-linum-mode t)

;; C-kで行全体を削除
(setq kill-whole-line t)

;;elscreen_config
(global-set-key (kbd "<C-lefttab>") 'elscreen-next)
(global-set-key (kbd "<C-iso-lefttab>") 'elscreen-previous)

;全角半角でmozc-mode
(global-set-key (kbd "<zenkaku-hankaku>") 'mozc-mode)

;
