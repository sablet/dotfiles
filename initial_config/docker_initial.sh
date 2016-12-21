#!/bin/bash

apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
echo 'deb https://apt.dockerproject.org/repo ubuntu-xenial main' | tee /etc/apt/sources.list.d/docker.list
apt update
apt install docker-engine

mkdir /etc/systemd/system/docker.service.d
echo [Service]\nEnvironment="HTTP_PROXY=$http_proxy" |tee /etc/systemd/system/docker.service.d/http-proxy.conf
systemctl daemon-reload
systemctl restart docker
