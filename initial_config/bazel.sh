# sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer

sudo apt-get install pkg-config zip g++ zlib1g-dev unzip

wget https://github.com/bazelbuild/bazel/releases/download/0.2.0/bazel-0.2.0-installer-linux-x86_64.sh
chmod +x bazel-0.2.0-installer-linux-x86_64.sh
./bazel-version-installer-os.sh --user

# add .bashrc
# export PATH="$PATH:$HOME/bin"
