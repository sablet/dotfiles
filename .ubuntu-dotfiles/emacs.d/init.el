(load-theme 'manoj-dark)
 
;; load-path ���ɲä���ؿ������
(defun add-to-load-path (&rest paths)
  (let (path)
    (dolist (path paths paths)
      (let ((default-directory
              (expand-file-name (concat user-emacs-directory path))))
        (add-to-list 'load-path default-directory)
        (if (fboundp 'normal-top-level-add-subdirs-to-load-path)
            (normal-top-level-add-subdirs-to-load-path))))))

;; �����Υǥ��쥯�ȥ�Ȥ��Υ��֥ǥ��쥯�ȥ��load-path���ɲ�
(add-to-load-path "elisp" "conf" "elpa" "el-get" ".python-environments" "site-lisp")

;init-loader
(require 'init-loader)
(init-loader-load "~/.emacs.d/conf")


(when (require 'auto-install nil t)
  (setq auto-install-directory "~/.emacs.d/elisp/")
  ;; EmacsWiki����Ͽ����Ƥ���elisp ��̾�����������
  (auto-install-update-emacswiki-package-name t)
  (auto-install-compatibility-setup))

(when (require 'package nil t)
  (add-to-list 'package-archives
               '("marmalade" . "http://marmalade-repo.org/packages/"))
  (add-to-list 'package-archives '("ELPA" . "http://tromey.com/elpa/"))
  (add-to-list 'package-archives '("melpa" . "http://melpa.milkbox.net/packages/") t)
  (package-initialize))

