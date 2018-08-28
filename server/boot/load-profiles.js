// Seed BIBFRAME profiles into storage if they aren't already there
// Read all .json files from data/profiles
// Use the file name as the profile name
'use strict';

module.exports = function(app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  const profilePath = '/opt/bibliomata/verso/data/profiles';
  const Config = app.models.Config;
  Config.count({configType: 'profile'}, function(err, count) {
    const fs = require('fs');
    if (err) { return console.warn(err.message); }
    if (count) {
      console.log('Skipping profile load (datastore is populated)');
    } else {
      const profileFiles = fs.readdirSync(profilePath);
      let data = [];
      for (let i = 0; i < profileFiles.length; i++) {
        let path = profilePath + '/' + profileFiles[i];
        if ((profileFiles[i].search('\.json$') != -1) &&
            (fs.statSync(path).isDirectory() === false)) {
          const name = profileFiles[i].substr(0, profileFiles[i].length - 5);
          const json = fs.readFileSync(path, {encoding: 'utf8'});
          data.push({
            name: name,
            configType: 'profile',
            json: json,
          });
        }
      }
      Config.create(data, function(err, models) {
        if (err) { return console.warn(err); }
        console.log('Created ' + models.length + ' profile(s)');
      });
    }
  });

  process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
