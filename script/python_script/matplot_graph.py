#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-

import numpy as np
import matplotlib.pyplot as plt
from itertools import chain
import sys,os,csv

fname=sys.argv[1]
f = open(fname, 'rb')
dict = []
c = csv.reader(f)  # CSV読み込み用オブジェクトの生成
for row in c:
    dict.append(row)
print dict
f.close()
