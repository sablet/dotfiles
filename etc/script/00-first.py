'''
this script is ipython initialization file
please link this file from
~/.ipython/profile_default/startup

cd $HOME
mkdir -p $HOME/.ipython/profile_default/startup
ln -s $HOME/Dropbox/script/00-first.py $HOME/.ipython/profile_default/startup/00-first.py
'''

# c.IPKernelApp.pylab = 'inline'

# %matplotlib inline
from sys import argv
import sys
import numpy as np
import matplotlib.pyplot as plt
import keras
from commands import getoutput
import os
import time
import pandas as pd
import statsmodels.api as sm
from multiprocessing import Pool
from IPython.core.display import HTML,Markdown 
import itertools
from datetime import datetime,timedelta
import json
import scipy
import math

def get_day(): return (datetime.now() + timedelta(hours=0)).strftime('20%y-%m-%d')
def utc_now(): return pd.to_datetime(datetime.now()).tz_localize('Asia/Tokyo').tz_convert('UTC')

if 'fx_esn' in getoutput('pwd'):
    sys.path.append('/home/nikke/git_dir/bitbucket/ml/fx_esn/lib')
    from myplot import * 
    from data_process import * 
    from models import *
    from utility import *
    from pd_oanda import *
    from trading import *
    from pd_oanda import *
