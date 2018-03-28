Verso - Node.js LoopbackAPI-based storage middleware

Prerequisites
-------------

Installing PM2
```$ npm install pm2 -g```

We use 'bibliomata' as a name for this particular application, so you may want to install everything in a common directory, e.g. {path}/bibliomata/

Installation
-------------
Navigate to your directory you created (e.g. /bibliomata).

```
$ git clone https://github.com/lcnetdev/verso.git
$ cd verso
$ npm install
$ sudo pm2 start server/server.js --name verso
```

To check:
```
$ sudo pm2 status
```

You should get a status screen (with a short uptime).

Save:

```
$ sudo pm2 save 
```

This will save a copy of the PM2 config in /root/.pm2/dump.pm2

To restart the cluster with the dump file:
```
$ sudo pm2 resurrect
```

Note: the data is preserved in a file verso/bfpilot.json.
