'use strict';

module.exports = function enableAuthentication(server) {
  // Enable authentication
  server.enableAuth();

  // Respond to login with user identity and token in cookies
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
        const currentUser = {
          id: ctx.result.userId,
          username: user.username,
          roles: roles,
        };
        ctx.res.cookie('current_user', JSON.stringify(currentUser));
      });
    ctx.res.cookie('access_token', ctx.result.id,
      {signed: true, expires: 0, httpOnly: true});
    return Promise.resolve();
  });

  // Clear cookies on logout
  server.models.User.afterRemote('logout', function(ctx) {
    ctx.res.clearCookie('access_token');
    ctx.res.clearCookie('current_user');
    return Promise.resolve();
  });
};
