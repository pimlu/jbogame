la zdelu
========

#### Online browser game

The aim of this project is to create an online multiplayer browser game that will incorporate Lojban.

### Installation

HTTP+postgres+redis:

  * `sudo ./setup.sh -ipd jbogame -ars 127.0.0.1`
  * set up `config.js`

Just postgres:

  * `sudo ./setup.sh -pad jbogame`

Just redis:

  * `sudo ./setup.sh -r`

Just HTTP:

  * `sudo ./setup.sh -is 127.0.0.1`
  * set up `config.js`
