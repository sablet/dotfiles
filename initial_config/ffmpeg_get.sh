sudo apt-get install -y nscd
wget http://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz
tar xvf ffmpeg-release-64bit-static.tar.xz
sudo cp ./ffmpeg-3.1.4-64bit-static/ffmpeg /usr/local/bin
rm ffmpeg-*
