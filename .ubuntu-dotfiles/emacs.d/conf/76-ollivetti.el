(require 'olivetti)
;;; 桁数
(setq-local olivetti-body-width 80)           ;桁数
(setq-local olivetti-body-width 0.6)          ;(window-width) に対する割合
;;; モードラインを隠す
(setq olivetti-hide-mode-line t)
;;; スペル覚えられないのでaliasにしとく(笑)
(defalias 'writing-mode 'olivetti-mode)
