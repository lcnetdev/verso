'use strict';

const fs = require('fs');
const PassportConfigurator =
  require('loopback-component-passport').PassportConfigurator;

module.exports = function(app) {
  const passportConfigurator = new PassportConfigurator(app);
  const ttl = 3600;
  const options = require('../providers.json')['ldap'];
  if (options.server.tlsOptions !== undefined && options.server.tlsOptions.certFile) {
    options.server.tlsOptions.ca = [ fs.readFileSync('server/' + options.server.tlsOptions.certFile) ];
  }
  passportConfigurator.init();
  passportConfigurator.setupModels({
    userModel: app.models.User,
    userIdentityModel: app.models.UserIdentity,
    userCredentialModel: app.models.UserCredential,
  });
  passportConfigurator.configureProvider('ldap', options);
};
