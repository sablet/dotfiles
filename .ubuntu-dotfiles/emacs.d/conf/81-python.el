(setq-default indent-tabs-mode nil)
(setq-default tab-width 2)
(setq-default python-indent-line 2)

(add-hook 'python-mode-hook
          (lambda ()
            ;;(define-key python-mode-map "\"" 'electric-pair)
            ;;(define-key python-mode-map "\'" 'electric-pair)
            (define-key python-mode-map "(" 'electric-pair)
            ;;(define-key python-mode-map "[" 'electric-pair)
            ;;(define-key python-mode-map "{" 'electric-pair)
            (electric-indent-mode)
            ))

(defun electric-pair ()
  "Insert character pair without sournding spaces"
  (interactive)
  (let (parens-require-spaces)
    (insert-pair)))

