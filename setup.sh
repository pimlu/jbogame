#!/bin/bash -e

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

apt-get install -y build-essential libudev-dev libdrm-dev\
  libgconf2-dev libgcrypt11-dev libpci-dev libxtst-dev python\
  libnss3-dev  libasound2-dev libpulse-dev libjpeg62-dev libxv-dev\
  libgtk2.0-dev libexpat1-dev

#if node is not installed
if ! hash node 2>/dev/null; then
  cd /tmp
  wget http://nodejs.org/dist/node-latest.tar.gz
  tar xvzf node-latest.tar.gz
  rm -f node-latest.tar.gz
  cd node-v*
  ./configure
  CXX="g++ -Wno-unused-local-typedefs" make -j2
  CXX="g++ -Wno-unused-local-typedefs" make install
  cd /tmp
  rm -rf /tmp/node-v*
  npm update -g npm
  npm update -g n node-debug bower
fi

cd $DIR

npm install
sudo -u $SUDO_USER bower install
