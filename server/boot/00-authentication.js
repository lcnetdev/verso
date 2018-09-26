'use strict';

module.exports = function enableAuthentication(server) {
  // Enable authentication
  if (process.env.AUTH === 'true')
    server.enableAuth();

  // Respond to login with user identity and token in cookies
  server.models.User.afterRemote('login', async function(ctx) {
    const currentUserLB = await server.models.User.findById(
      ctx.result.userId,
      {include: 'roles'}
    );
    const currentUser = currentUserLB.toJSON();
    var roles = [];
    currentUser.roles.forEach(function(role) {
      roles.push(role.name);
    });
    const userIdentity = {
      id: ctx.result.userId,
      username: currentUser.username,
      roles: roles,
    };
    ctx.res.cookie('current_user', JSON.stringify(userIdentity));
    ctx.res.cookie(
      'access_token',
      ctx.result.id,
      {signed: true, expires: 0, httpOnly: true}
    );
    return Promise.resolve();
  });

  // Clear cookies on logout
  server.models.User.afterRemote('logout', function(ctx) {
    ctx.res.clearCookie('access_token');
    ctx.res.clearCookie('current_user');
    return Promise.resolve();
  });
};
