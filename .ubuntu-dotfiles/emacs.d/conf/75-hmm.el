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
