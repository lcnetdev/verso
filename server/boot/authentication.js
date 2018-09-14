'use strict';

module.exports = function enableAuthentication(server) {
  // Enable authentication
  server.enableAuth();

  // Respond to login with token in cookie
  server.models.User.afterRemote('login', function(ctx) {
    ctx.res.cookie('access_token', ctx.result.id,
      {signed: true, expires: 0, httpOnly: true});
    return Promise.resolve();
  });

  // Clear cookie on logout
  server.models.User.afterRemote('logout', function(ctx) {
    ctx.res.clearCookie('access_token');
    return Promise.resolve();
  });
};
