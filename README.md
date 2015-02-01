la zdelu
========

#### Online browser game

The aim of this project is to create an online multiplayer browser game that will incorporate Lojban.

Development is done on Linux Mint, and other distros are not supported.  Other closely related distros such as Ubuntu may work too.

### Usage

The install script has to download quite a few files, be patient.  Running `sudo apt-get update && sudo apt-get upgrade` beforehand is recommended.
  
  * To install: `sudo ./setup.sh -cipd jbogame -ars 127.0.0.1`
  * To run: `npm start`
  * To connect: go to [localhost:8080](http://localhost:8080/)

### Technical details

Information on how this works is in [details.md](details.md).
