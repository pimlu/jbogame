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

### Directory structure

First, do note that occasional refactoring happens, and these directories and their contents have shifted over time.  Not recently though.

  * `client`: Contains the stuff that gets sent over when someone requests for `/kelci/*`.  It'll have some extra things in place for require.js optimization later.
  * `front`: Contains code for all the frontend web stuff that is *not* actually part of the "game" itself.  Everything from the home page to signing up is here.  The game client actually does request `/auth` when you sign in though.
  * `master`: Everything that's basically a one-time thing each launch belongs in here.  (checking/constructing the database, revving up the cluster, deciding which machines are responsible for which servers)
  * `proxy`: The reverse proxy.  Currently the "closest code" to the user in that every request goes through it first.  All the websockets for gameservers go through it too.  Maybe when Let's Encrypt rolls around, I might not need this so much.  Currently responsible for TLS, naturally.
  * `server`: Everything belonging to the actual gameserver goes in here.  This will no doubt consume most of my resources.  When you log in, this code is what's making it happen.
  * `shared`: Stuff that multiple sections of the project require- for example, both the `server` and `front` need `knexutils.js`, which has database helper functions, so it's here.  I kind of need a better way of organizing this.  Also has scripts shared by both server and client, but it's only statically served in development. (in production, require.js will take care of that)
  * `tools`: Intended to have developer tools that have no business being sent to users in production.  Currently has some obsolete stuff that I might do things with later.
