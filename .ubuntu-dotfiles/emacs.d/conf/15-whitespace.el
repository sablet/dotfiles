; ;; Show white space, tab, and so on.
; ;; ref. http://openlab.dino.co.jp/2008/07/15/233005294.html
;  
; ;;(defface my-face-r-1 '((t (:background "gray15"))) nil)
; (defface my-face-b-1 '((t (:background "gray"))) nil) ; color of zenkaku-space
; (defface my-face-b-2 '((t (:background "gray26"))) nil) ; color of tab
; (defface my-face-u-1 '((t (:foreground "SteelBlue" :underline t))) nil)
; ;;(defvar my-face-r-1 'my-face-r-1)
; (defvar my-face-b-1 'my-face-b-1)
; (defvar my-face-b-2 'my-face-b-2)
; (defvar my-face-u-1 'my-face-u-1)
;  
; (defadvice font-lock-mode (before my-font-lock-mode ())
;   (font-lock-add-keywords
;    major-mode
;    '(("\t" 0 my-face-b-2 append)
;      ("¡¡" 0 my-face-b-1 append)
;      ("[ \t]+$" 0 my-face-u-1 append)
;      ;;("[\r]*\n" 0 my-face-r-1 append)
;      )))
; (ad-enable-advice 'font-lock-mode 'before 'my-font-lock-mode)
; (ad-activate 'font-lock-mode)
; ;; settings for text file
; (add-hook 'text-mode-hook
;           '(lambda ()
;              (progn
;                (font-lock-mode t)
;                (font-lock-fontify-buffer))))
