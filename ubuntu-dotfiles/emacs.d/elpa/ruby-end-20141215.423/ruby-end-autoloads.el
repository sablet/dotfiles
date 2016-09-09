;;; ruby-end-autoloads.el --- automatically extracted autoloads
;;
;;; Code:


;;;### (autoloads (ruby-end-mode) "ruby-end" "ruby-end.el" (21751
;;;;;;  5605 316458 25000))
;;; Generated autoloads from ruby-end.el

(autoload 'ruby-end-mode "ruby-end" "\
Automatic insertion of end blocks for Ruby.

\(fn &optional ARG)" t nil)

(add-hook 'ruby-mode-hook 'ruby-end-mode)

(add-hook 'enh-ruby-mode-hook 'ruby-end-mode)

;;;***

;;;### (autoloads nil nil ("ruby-end-pkg.el") (21751 5605 337702
;;;;;;  342000))

;;;***

(provide 'ruby-end-autoloads)
;; Local Variables:
;; version-control: never
;; no-byte-compile: t
;; no-update-autoloads: t
;; coding: utf-8
;; End:
;;; ruby-end-autoloads.el ends here
