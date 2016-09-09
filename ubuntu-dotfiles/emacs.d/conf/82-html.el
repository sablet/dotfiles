(require 'web-mode)
(add-to-list 'auto-mode-alist '("\\.html\\'" . web-mode))

(defun web-mode-hock()
  (setq web-mode-markup-indent-offset 2))
(add-hook 'web-mode-hook 'web-mode-hock)


