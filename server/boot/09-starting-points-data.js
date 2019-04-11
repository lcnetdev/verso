// Seed Vocabularies into storage if they aren't already there
// Read all .rdf files from data/vocabularies
// Use the file name as the vocabulary name
'use strict';
const startingPoints = require('../../data/config/startingPoints.json');

let data = [];

module.exports = function(app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  const Config = app.models.Config;
  Config.count({configType: 'startingPoints'}, function(err, count) {
    if (err) { return console.warn(err.message); }
    if (count) {
      console.log('Skipping types load (datastore is populated)');
    } else {
      data.push({
        name: 'config',
        configType: 'startingPoints',
        json: startingPoints,
      });
      
      Config.create(data, function(err, models) {
        if (err) { return console.warn(err); }
        console.log('Created ' + models.length + ' startingPoints');
      });
    }
  });

  process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
