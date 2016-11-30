;window切替
(define-key global-map (kbd "C-t") 'other-window)

;;redo+
(when (require 'redo+ nil t)
;;  (global-set-key (kbd "M-[") 'redo)
;;  (global-set-key (kbd "M-]") 'undo))
  (global-set-key (kbd "C-/") 'redo)
  (global-set-key (kbd "C-.") 'undo))

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

;全角半角でmozc-mode
(global-set-key (kbd "M-t") 'tex2pdf_open)
