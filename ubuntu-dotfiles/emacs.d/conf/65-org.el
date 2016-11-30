(defun org-mode-hooks ()
	(when (require 'org-mode nil t)
		(setq truncat-lines (not truncate-lines))))

(add-hook 'org-mode-hook 'org-mode-hooks)
