// Seed Vocabularies into storage if they aren't already there
// Read all .rdf files from data/vocabularies
// Use the file name as the vocabulary name
'use strict';
const iso6391 = require('../../data/vocabularies/ISO-639-1-language.json');
const iso6392 = require('../../data/vocabularies/ISO-639-2-language.json');
const literalLangPatterns = require('../../data/vocabularies/language-script-patterns.json');
const iso15924 = require('../../data/vocabularies/ISO-15924-script.json');
const iso6392to6391 = require('../../data/vocabularies/ISO-6391-to-6392.json');

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
  Config.count({configType: 'literalLangData'}, function(err, count) {
    if (err) { return console.warn(err.message); }
    if (count) {
      console.log('Skipping types load (datastore is populated)');
    } else {
      data.push({
        name: 'iso6391',
        configType: 'literalLangData',
        json: iso6391,
      });
      data.push({
        name: 'iso6392',
        configType: 'literalLangData',
        json: iso6392,
      });
      data.push({
        name: 'iso15924',
        configType: 'literalLangData',
        json: iso15924,
      })
      data.push({
        name: 'literalLangPatterns',
        configType: 'literalLangData',
        json: literalLangPatterns,
      })
      data.push({
        name: 'iso6392to6391',
        configType: 'literalLangData',
        json: iso6392to6391,
      })
      
      Config.create(data, function(err, models) {
        if (err) { return console.warn(err); }
        console.log('Created ' + models.length + ' literalLangData');
      });
    }
  });

  process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
