// Creates admin and profile_editor roles if they don't exist.
// And prompts for a password for the admin user.
//
// Set the environment variable DEV_USER_PW to create a sample user named
// for each role with the provided password.
'use strict';

module.exports = function(app) {
  const {User, Role, RoleMapping, ACL} = app.models;
  Role.findOne({where: {name: 'admin'}}, function(err, adminRole) {
    if (err) throw err;
    if (adminRole !== null) return;
    Role.create([
      {name: 'admin'},
      {name: 'profile_editor'},
    ], function(err, roles) {
      if (err) throw err;

      if (process.env.DEV_USER_PW) {
        // Create dev users
        User.create([
          {
            username: 'admin',
            email: 'admin@dev.user',
            password: process.env.DEV_USER_PW,
          },
          {
            username: 'profile_editor',
            email: 'profile_editor@dev.user',
            password: process.env.DEV_USER_PW,
          },
          {
            username: 'user',
            email: 'user@dev.user',
            password: process.env.DEV_USER_PW,
          },
        ], function(err, users) {
          if (err) throw err;
          roles[0].principals.create({
            principalType: RoleMapping.USER,
            principalId: users[0].id,
          });
          roles[1].principals.create({
            principalType: RoleMapping.USER,
            principalId: users[1].id,
          });
          console.log('Created development users');
        });
      } else {
        // Interactively create admin user
        (async function() {
          const inquirer = require('inquirer');
          console.log('\nNo admin role present, assuming first run.');
          const adminUserMd = {username: 'admin'};
          adminUserMd.email = (await inquirer.prompt({
            type: 'input',
            name: 'email',
            message: 'Email for admin user?',
          })).email;
          const confirmPassword = async function() {
            const pwAttempt = await inquirer.prompt([
              {
                type: 'password',
                name: 'password',
                message: 'Password for admin user?',
              },
              {
                type: 'password',
                name: 'confirmation',
                message: 'Confirm password for admin user?',
              },
            ]);
            if (pwAttempt.password === pwAttempt.confirmation) {
              return pwAttempt.password;
            } else {
              console.log('Passwords do not match, try again.');
              return confirmPassword();
            }
          };
          adminUserMd.password = await confirmPassword();
          const adminUser = await User.create(adminUserMd);
          const adminRole = await Role.findOne({where: {name: 'admin'}});
          await adminRole.principals.create({
            principalType: RoleMapping.USER,
            principalId: adminUser.id,
          });
          console.log('Admin user created.');
        })();
      }

      // Allow admin role to manage users/roles
      ACL.create({
        model: 'User',
        property: '*',
        accessType: '*',
        principalType: 'ROLE',
        principalId: roles[0].id,
        permission: 'ALLOW',
      });
      ACL.create({
        model: 'Role',
        property: '*',
        accessType: '*',
        principalType: 'ROLE',
        principalId: roles[0].id,
        permission: 'ALLOW',
      });
      ACL.create({
        model: 'RoleMapping',
        property: '*',
        accessType: '*',
        principalType: 'ROLE',
        principalId: roles[0].id,
        permission: 'ALLOW',
      });
    });
  });
};
