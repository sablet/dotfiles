#!/usr/bin/env python
# -*- coding: utf-8 -*-

import numpy as np
import matplotlib.pyplot as plt
from itertools import chain
from sys import *
from os import *

fname,ext=path.splitext(argv[1])
save_fname = fname+ '.png'
cmd = "head " + argv[1]

system(cmd)
print "please enter row number"

'''
data =np.genfromtxt(
    sys.argv[1],
    delimiter=',',
    names=True,
    usecols=int(sys.argv[2]))

form_data=np.array(list(chain.from_iterable(data)))

if len(sys.argv) == 4:
    y,ind,pacthes = plt.hist(form_data*float(sys.argv[3]),bins=100)
    data_sum = int(np.sum(form_data * float(sys.argv[3])))
    mu = int(data_sum / len(form_data))
else:
    y,ind,pacthes = plt.hist(form_data,bins=100)
    data_sum = np.sum(form_data)
    mu = int(data_sum / len(form_data))


titt = fname + ' trades:' + str(len(form_data)) + ' mu:' + str(mu) + ' sum:' + str(data_sum)
plt.title(titt,fontsize=20)
plt.savefig(save_fname)
'''
