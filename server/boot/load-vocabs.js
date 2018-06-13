// Seed Vocabularies into storage if they aren't already there
// Read all .rdf files from data/vocabularies
// Use the file name as the vocabulary name
'use strict';
const names = {'bflc':'LC BIBFRAME 2.0 Extensions','mads':'MADSRDF','bibframe':'Bibframe','languages':'Languages'};

module.exports = function(app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  const vocabPath = 'data/vocabularies';
  const Config = app.models.Config;
  Config.count({configType: 'vocabulary'}, function(err, count) {
    const fs = require('fs');
    const parser = require('xml2json');
    if (err) { return console.warn(err.message); }
    if (count) {
      console.log('Skipping vocabulary load (datastore is populated)');
    } else {
      const vocabFiles = fs.readdirSync(vocabPath);
      let data = [];
      for (let i = 0; i < vocabFiles.length; i++) {
        let path = vocabPath + '/' + vocabFiles[i];
        if ((vocabFiles[i].search('\.rdf$') != -1) &&
            (fs.statSync(path).isDirectory() === false)) {
          const fname = vocabFiles[i].substr(0, vocabFiles[i].length - 4);
	  const name = names[fname];
	  console.log(name);
          const xml = fs.readFileSync(path, {encoding: 'utf8'});
	  const json = parser.toJson(xml);
          data.push({
            name: name,
            configType: 'vocabulary',
            json: json,
          });
        }
      }
      Config.create(data, function(err, models) {
        if (err) { return console.warn(err); }
        console.log('Created ' + models.length + ' vocabularies');
      });
    }
  });

  process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
