;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; 7.2 Flymakeによる文法チェック                          ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;; P182-183 Makefileがあれば利用し、なければ直接コマンドを実行する
;;; Makefileの種類を定義
;(defvar flymake-makefile-filenames
;  '("Makefile" "makefile" "GNUmakefile")
;  "File names for make.")
; 
;;; Makefileがなければコマンドを直接利用するコマンドラインを生成
;(defun flymake-get-make-gcc-cmdline (source base-dir)
;  (let (found)
;    (dolist (makefile flymake-makefile-filenames)
;      (if (file-readable-p (concat base-dir "/" makefile))
;          (setq found t)))
;    (if found
;        (list "make"
;              (list "-s"
;                    "-C"
;                    base-dir
;                    (concat "CHK_SOURCES=" source)
;                    "SYNTAX_CHECK_MODE=1"
;                    "check-syntax"))
;      (list (if (string= (file-name-extension source) "c") "gcc" "g++")
;            (list "-o"
;                  "/dev/null"
;                  "-fsyntax-only"
;                  "-Wall"
;                  source)))))
; 
;;; Flymake初期化関数の生成
;(defun flymake-simple-make-gcc-init-impl
;  (create-temp-f use-relative-base-dir
;                 use-relative-source build-file-name get-cmdline-f)
;  "Create syntax check command line for a directly checked source file.
;Use CREATE-TEMP-F for creating temp copy."
;  (let* ((args nil)
;         (source-file-name buffer-file-name)
;         (buildfile-dir (file-name-directory source-file-name)))
;    (if buildfile-dir
;        (let* ((temp-source-file-name
;                (flymake-init-create-temp-buffer-copy create-temp-f)))
;          (setq args
;                (flymake-get-syntax-check-program-args
;                 temp-source-file-name
;                 buildfile-dir
;                 use-relative-base-dir
;                 use-relative-source
;                 get-cmdline-f))))
;    args))
; 
;;; 初期化関数を定義
;(defun flymake-simple-make-gcc-init ()
;  (message "%s" (flymake-simple-make-gcc-init-impl
;                 'flymake-create-temp-inplace t t "Makefile"
;                 'flymake-get-make-gcc-cmdline))
;  (flymake-simple-make-gcc-init-impl
;   'flymake-create-temp-inplace t t "Makefile"
;   'flymake-get-make-gcc-cmdline))
; 
;;; 拡張子 .c, .cpp, c++などのときに上記の関数を利用する
;; (add-to-list 'flymake-allowed-file-name-masks
;;              '("\\.\\(?:c\\(?:pp\\|xx\\|\\+\\+\\)?\\|CC\\)\\'"
;;                flymake-simple-make-gcc-init))
; 
;;;; P184 XMLとHTML
;;; XML用Flymakeの設定
;(defun flymake-xml-init ()
;  (list "xmllint" (list "--valid"
;                        (flymake-init-create-temp-buffer-copy
;                         'flymake-create-temp-inplace))))
; 
;;; HTML用Flymakeの設定
;(defun flymake-html-init ()
;  (list "tidy" (list (flymake-init-create-temp-buffer-copy
;                      'flymake-create-temp-inplace))))
; 
;(add-to-list 'flymake-allowed-file-name-masks
;             '("\\.html\\'" flymake-html-init))
; 
;;; tidy error pattern
;(add-to-list 'flymake-err-line-patterns
;'("line \\([0-9]+\\) column \\([0-9]+\\) - \\(Warning\\|Error\\): \\(.*\\)"
;  nil 1 2 4))
; 
;;;; P186 Ruby
;;; Ruby用Flymakeの設定
;(defun flymake-ruby-init ()
;  (list "ruby" (list "-c" (flymake-init-create-temp-buffer-copy
;                           'flymake-create-temp-inplace))))
; 
;;(add-to-list 'flymake-allowed-file-name-masks
; ;            '("\\.rb\\'" flymake-ruby-init))
; 
;(add-to-list 'flymake-err-line-patterns
;             '("\\(.*\\):(\\([0-9]+\\)): \\(.*\\)" 1 2 nil 3))
