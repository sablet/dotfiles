;;; elscreen-persist-autoloads.el --- automatically extracted autoloads
;;
;;; Code:
(add-to-list 'load-path (or (file-name-directory #$) (car load-path)))

;;;### (autoloads nil "elscreen-persist" "elscreen-persist.el" (21780
;;;;;;  45780 161831 383000))
;;; Generated autoloads from elscreen-persist.el

(autoload 'elscreen-persist-store "elscreen-persist" "\
Store the screens, window configurations and frame parameters.

\(fn)" t nil)

(autoload 'elscreen-persist-restore "elscreen-persist" "\
Restore the screens, window configurations, and also the frame parameters if necessary.

\(fn)" t nil)

(defvar elscreen-persist-mode nil "\
Non-nil if Elscreen-Persist mode is enabled.
See the command `elscreen-persist-mode' for a description of this minor mode.
Setting this variable directly does not take effect;
either customize it (see the info node `Easy Customization')
or call the function `elscreen-persist-mode'.")

(custom-autoload 'elscreen-persist-mode "elscreen-persist" nil)

(autoload 'elscreen-persist-mode "elscreen-persist" "\
Toggle persistent elscreen (ElScreen Persist mode).
With a prefix argument ARG, enable ElScreen Persist mode if ARG is
positive, and disable it otherwise.  If called from Lisp, enable
the mode if ARG is omitted or nil.

\(fn &optional ARG)" t nil)

;;;***

;; Local Variables:
;; version-control: never
;; no-byte-compile: t
;; no-update-autoloads: t
;; End:
;;; elscreen-persist-autoloads.el ends here
