(defun hello ()
  (interactive)  ; コマンド登録
  (message "hello elisp world"))

(defun tex2pdf_open ()
  (interactive)
  (setq filename (buffer-file-name (current-buffer)))
  (setq offset (format "%d" (point)))
  (call-process "tex2pdf_open" nil nil nil "parent" offset))

