#!/bin/bash

apt-get install -y git subversion unzip curl
apt-get install -y build-essential gfortran
sudo apt-get install -y python-virtualenv python-dev
sudo apt-get install -y libatlas-base-dev swig libhdf5-dev python-tk python-pydot

wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py

git clone https://gist.github.com/knzm/91f88e1703360a3904c7
cd 91f88e1703360a3904c7
chmod +x install.sh
source ./install.sh

virtualenv ~/virtualenvs/tensorflow-gpu --system-site-packages
source ~/virtualenvs/tensorflow-gpu/bin/activate
pip install https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow-0.6.0-cp27-none-linux_x86_64.whl
pip install matplotlib
pip install keras
