#!/bin/bash

DISPLAY=:0
xterm -hold -e zsh -c "zsh -i -c 'forecast \*' |less"
