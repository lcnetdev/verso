'use strict';

module.exports = function enableAuthentication(server) {
  // Enable authentication
  server.enableAuth();

  // Respond to login with token in cookie
  server.models.User.afterRemote('login', function(ctx) {
    server.models.User.findById(
      ctx.result.userId,
      {include: 'roles'},
      function(err, instance) {
        if (err) throw err;
        const user = instance.toJSON();
        var roles = [];
        user.roles.forEach(function(role) {
          roles.push(role.name);
        });
        const userId = {username: user.username, roles: roles};
        ctx.res.cookie('access_id', JSON.stringify(userId));
      });
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
