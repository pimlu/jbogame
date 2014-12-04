#!/bin/bash -e
echo "  ( ͡`tput bold;tput setaf 1`°`tput sgr0` ͜ʖ ͡`tput bold;tput setaf 1`°`tput sgr0`)"
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cd $DIR
function helpmsg {
  echo "  usage: ./setup.sh [OPTIONS]

  OPTIONS
  -------
  -h: shows this help and exits
  -i: installs necessary apt packages, lastest version of node.js,
      updates npm, does npm/bower install
  -p: installs postgres if not already
  -d <name>: creates a database named <name> on your postgres installation
  -a: sets up trust-based auth in postgres
  -s <fqdn>: creates a self-signed cert for you with commonName <fqdn>"
  exit 1
}
if [ $# == 0 ]; then helpmsg; fi
while getopts ":hipd:as:" opt; do case $opt in
  h)
    helpmsg ;;
  i)
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
    ;;
  p)
    apt-get install -y postgresql postgresql-contrib ;;
  d)
    sudo -u postgres psql -c "create database $OPTARG" ;;
  a)
    VERSION=`sudo -u postgres psql -c 'SELECT version()'\
    |grep -oh "[0-9]\.[0-9]"|tr " " "\n"|head -n 1`
    HBA=`sudo -u postgres psql -c 'SHOW hba_file'|grep /`
    NEWHBA=$HBA.`date +"%s"`.backup
    [ -e $HBA ] && mv $HBA $NEWHBA
    echo "local all all trust
host all all 127.0.0.1/32 trust
host all all ::1/128 trust" >> $HBA
    pg_ctlcluster $VERSION main reload
    ;;
  s)
    apt-get install -y openssl
    #this bit right here was automated thanks to someone's gist on github
    cd $DIR/https
    DOMAIN=$OPTARG
    FILE=zdelu
    ( ls -1|grep $FILE ) && rm `ls -1|grep $FILE`

    # Generate a passphrase
    export PASSPHRASE=$(head -c 500 /dev/urandom | tr -dc a-z0-9A-Z | head -c 128; echo)
    trap 'unset PASSPHRASE' EXIT

    subj="/C=JB/ST=Lojbanistan/O=la zdelu/localityName=.irci/commonName=$DOMAIN\
    /organizationalUnitName=selkei/emailAddress=pimlu@users.noreply.github.com"

    # Generate the server private key
    openssl genrsa -des3 -out $FILE.key -passout env:PASSPHRASE 2048

    # Generate the CSR
    openssl req \
    -new \
    -batch \
    -subj "$(echo -n "$subj" | tr "\n" "/")" \
    -key $FILE.key \
    -out $FILE.csr \
    -passin env:PASSPHRASE

    cp $FILE.key $FILE.key.org

    # Strip the password so we dont have to type it every time we restart
    openssl rsa -in $FILE.key.org -out $FILE.key -passin env:PASSPHRASE

    # Generate the cert (good for 10 years)
    openssl x509 -req -days 3650 -in $FILE.csr -signkey $FILE.key -out $FILE.crt
    echo success
    ;;
  \?)
    echo "  invalid flag: -$OPTARG"
    helpmsg
    ;;
  :)
    echo "  -$OPTARG requires an argument"
    helpmsg
    ;;
esac;done
