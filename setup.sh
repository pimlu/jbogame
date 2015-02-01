#!/bin/bash -e
echo "  ( ͡`tput bold;tput setaf 1`°`tput sgr0` ͜ʖ ͡`tput bold;tput setaf 1`°`tput sgr0`)"
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cd $DIR
function helpmsg {
  echo "  usage: sudo ./setup.sh [OPTIONS]

  OPTIONS
  -------
  -h: shows this help and exits
  -i: installs necessary apt packages, lastest version of node.js,
      updates npm, does npm/bower install
  -p: installs postgres if not already
  -d <name>: creates a database named <name> on your postgres installation
  -r: sets up redis
  -b <intf>: tells redis to bind to <intf>
  -a: sets up trust-based auth in postgres
  -s <fqdn>: creates a self-signed cert for you with commonName <fqdn>
  -c: copies config.js.example into config.js"
  [ $# != 0 ] && echo `tput bold`$1`tput sgr0`
  exit 1
}
[ $# == 0 ] && helpmsg
! [ $(id -u) = 0 ] && helpmsg "this script requires root."
while getopts ":hipd:rb:as:c" opt; do case $opt in
  h)
    helpmsg ;;
  i)
    apt-get update
    apt-get install -y curl build-essential nodejs nodejs-legacy npm
    
    cd $DIR
    
    npm install -g npm
    npm install -g n bower
    
    n stable
    
    npm install
    sudo -u $SUDO_USER bower install

    ;;
  p)
    apt-get install -y postgresql postgresql-contrib ;;
  d)
    sudo -u postgres psql -c "create database $OPTARG" ;;
  r)
    apt-get install -y redis-server ;;
  b)
    CNF=/etc/redis/redis.conf
    NEWCNF=$CNF.`date +"%s"`.backup
    mv $CNF $NEWCNF
    sed 's/bind 127.0.0.1/& '$OPTARG'/' $NEWCNF>$CNF
    service redis-server restart
    ;;
  a)
    VERSION=`sudo -u postgres psql -c 'SELECT version()'\
    |grep -oh "[0-9]\.[0-9]"|tr " " "\n"|head -n 1`
    HBA=`sudo -u postgres psql -c 'SHOW hba_file'|grep /`
    BUHBA=$HBA.`date +"%s"`.backup
    [ -e $HBA ] && { mv $HBA $BUHBA; echo "backup config written to $BUHBA"; }
    echo "local all all trust
host all all 127.0.0.1/32 trust
host all all ::1/128 trust" >> $HBA
    pg_ctlcluster $VERSION main reload
    ;;
  s)
    apt-get install -y openssl
    #this bit right here was automated thanks to someone's gist on github
    cd $DIR/proxy/https
    DOMAIN=$OPTARG
    FILE=zdelu
    ( ls -1|grep $FILE ) && rm `ls -1|grep $FILE`

    # Generate a passphrase
    export PASSPHRASE=$(head -c 500 /dev/urandom | tr -dc a-z0-9A-Z | head -c 128; echo)
    trap 'unset PASSPHRASE' EXIT

    subj="
C=JB
ST=Lojbanistan
O=la zdelu
localityName=.irci
commonName=$DOMAIN
organizationalUnitName=selkei
emailAddress=pimlu@users.noreply.github.com"

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
    echo successfully created self signed cert
    ;;
  c)
    CFG='config.js'
    BUCFG=$CFG.`date +"%s"`.backup
    sudo -u $SUDO_USER [ -e $CFG ] && { mv $CFG $BUCFG; echo "backup config written to $BUCFG"; }
    sudo -u $SUDO_USER cp "$CFG".example $CFG
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
