'use strict';

module.exports = function(Quarto) {

	Quarto.remoteMethod('createBf', {
	accepts: [
		{arg: 'data', type: 'object', http: { source: 'body' } },
		{arg: 'Accept', type: 'string', http: { target: 'header' }}
	   ]
	});

};
