;; Emacs-BGEX patch
(when (boundp 'bgex-exist-p)
  (require 'bgex)

;;  (bgex-set-color-default "black")
;;  (bgex-set-image-default "~/Pictures/moon.jpg")
  (bgex-set-image-default "~/Pictures/nature/forest2_c.jpg")

; html-mode の(major-mode に対して)背景色を指定
  (bgex-set-color "HTML" 'bgex-identifier-type-major-mode '(60000 40000 40000))

  (bgex-set-image "PYTHON" 'bgex-identifier-type-major-mode "~/Pictures/math.jpg")
;    "python" "~/Pictures/math.jpg")
)









