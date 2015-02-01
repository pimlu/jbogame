This file is kept as up to date as possible, but sometimes I might forget to change it.

### Directory structure

* `client`: Contains the stuff that gets sent over when someone requests for `/kelci/*`.  It'll have some extra things in place for require.js optimization later.
* `front`: Contains code for all the frontend web stuff that is *not* actually part of the "game" itself.  Everything from the home page to signing up is here.  The game client actually does request `/auth` when you sign in though.
* `master`: Everything that's basically a one-time thing each launch belongs in here.  (checking/constructing the database, revving up the cluster, deciding which machines are responsible for which servers)
* `proxy`: The reverse proxy.  Currently the "closest code" to the user in that every request goes through it first.  All the websockets for gameservers go through it too.  Maybe when Let's Encrypt rolls around, I might not need this so much.  Currently responsible for TLS, naturally.
* `server`: Everything belonging to the actual gameserver goes in here.  This will no doubt consume most of my resources.  When you log in, this code is what's making it happen.
* `shared`: Stuff that multiple sections of the project require- for example, both the `server` and `front` need `knexutils.js`, which has database helper functions, so it's here.  I kind of need a better way of organizing this.  Also has scripts shared by both server and client, but it's only statically served in development. (in production, require.js will take care of that)
* `tools`: Intended to have developer tools that have no business being sent to users in production.  Currently has some obsolete stuff that I might do things with later.


### Startup process

This is what happens when you run it (at present).

Keep in mind that who's responsible for what is dependent on `config.js`.  One machine could be responsible for the reverse proxy, one for the frontend, one for databases, and twenty-seven to share all the star systems.  It doesn't matter.  When I say "the proxy worker", I mean "the proxy worker on whatever machine is responsible for being the reverse proxy".  By default, `config.js.example` puts everything on one machine.

When the package is run, it checks `config.js` and forks workers accordingly, however it doesn't make any star system workers yet.  The front worker(s) sets up express and listens on its own port, and proxy worker points connections to it by default.

If the machine is responsible for part of the load of star systems, it listens on redis pubsub for a signal.  That way, I can start up a few different star system machines and have them all wait for my signal.  Then, upon receiving the signal (which `config.js` can be configured to do, or you can run `master/rev.js` yourself), all the star system machines respond with how many cores they have.  `rev.js` then takes this information and balances star system load between these machines, reporting back the "plan" for who's responsible for what via pubsub again.

The star system machines fork a bunch of gameserver workers based on how many star systems they're responsible for, and they start listening.  They also report via pubsub that they are online, which proxy is subscribed to.  Proxy sets up special routing when you go to `/system/system_name`- proxy keeps track of which machine is responsible for the star system with that name.
