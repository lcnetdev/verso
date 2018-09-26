// Seed Vocabularies into storage if they aren't already there
// Read all .rdf files from data/vocabularies
// Use the file name as the vocabulary name
'use strict';
const data = [
  {
    'configType': 'ontology',
    'name': 'Bibframe-ontology',
    'json': {'label': 'Bibframe 2.0', 'url': 'http://id.loc.gov/ontologies/bibframe.rdf'},
  },
  {
    'configType': 'ontology',
    'name': 'BFLC-ontology',
    'json': {'label': 'BFLC', 'url': 'http://id.loc.gov/ontologies/bflc.rdf'},
  },
  {
    'configType': 'ontology',
    'name': 'MADSRDF-ontology',
    'json': {'label': 'MADSRDF', 'url': 'http://www.loc.gov/standards/mads/rdf/v1.rdf'},
  },
  {
    'configType': 'ontology',
    'name': 'RDF-ontology',
    'json': {'label': 'RDF', 'url': 'http://www.w3.org/1999/02/22-rdf-syntax-ns.rdf'},
  },
  {
    'configType': 'ontology',
    'name': 'RDF-Schema-ontology',
    'json': {'label': 'RDFS', 'url': 'http://www.w3.org/2000/01/rdf-schema.rdf'},
  },
];

module.exports = function(app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  const Config = app.models.Config;
  Config.count({configType: 'ontology'}, function(err, count) {
    if (err) { return console.warn(err.message); }
    if (count) {
      console.log('Skipping ontology load (datastore is populated)');
    } else {
      	Config.create(data, function(err, models) {
        	if (err) { return console.warn(err); }
       		console.log('Created ' + models.length + ' ontolgies');
      });
    }
  });

  process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
