// Create admin and profile_editor roles if they don't exist.
// And prompt for a password for the admin user.
//
// Set the environment variable DEV_USER_PW to create a sample user named
// for each role with the provided password.
//
// Enhance the built-in models to allow for easier User and Role management
// Give the admin Role access to manage users
//
// Relevant resources:
// https://gist.github.com/spencermefford/bc73812f216e0e254ad1
// https://gist.github.com/leftclickben/aa3cf418312c0ffcc547

'use strict';

module.exports = function(app) {
  const ACL = app.models.ACL;
  const User = app.models.User;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;

  // Create admin and profile_editor roles if they don't exist
  // If DEV_USER_PW is set, create dev users, otherwise create admin user interactively
  Role.findOne({where: {name: 'admin'}}, function(err, adminRole) {
    if (err) throw err;
    if (adminRole !== null) return;
    Role.create([
      {name: 'admin', id: 'admin'}, // Set the ID for the admin role for use in admin access ACL
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
          console.log('\nPLEASE NOTE ALL FIELDS ARE REQUIRED!');
          const adminUserMd = {username: 'admin'};
          const emailRe = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
          const emailAddr = async function() {
            const emailAttempt = await inquirer.prompt({
              type: 'input',
              name: 'email',
              message: 'Email for admin user?',
            });
            if (emailRe.test(emailAttempt.email)) {
              return emailAttempt.email;
            } else {
              console.log('Invalid email address, try again.');
              return emailAddr();
            }
          };
          adminUserMd.email = await emailAddr();
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
              if (pwAttempt.password == '') {
                console.log('Password cannot be empty, try again.');
                return confirmPassword();
              } else {
                return pwAttempt.password;
              }
            } else {
              console.log('Passwords do not match, try again.');
              return confirmPassword();
            }
          };
          adminUserMd.password = await confirmPassword();
          var adminUser, adminRole;
          try {
            adminUser = await User.create(adminUserMd);
            adminRole = await Role.findOne({where: {name: 'admin'}});
            await adminRole.principals.create({
              principalType: RoleMapping.USER,
              principalId: adminUser.id,
            });
            console.log('Admin user created.');
          } catch (err) {
            console.warn('Unable to create admin user: ' + err);
          }
        })();
      }
    });
  });

  // Ensure that the `admin` role has access to manage users.
  ACL.findOrCreate(
    {
      model: 'User',
      principalType: 'ROLE',
      principalId: 'admin',
      property: '*',
      accessType: '*',
      permission: 'ALLOW',
    },
    function(err, acl) {
      if (err) throw err;
    }
  );

  // Create relationships
  User.hasMany(Role, {through: RoleMapping, foreignKey: 'principalId'});

  // Remove unwanted remote methods that we are overriding
  User.disableRemoteMethodByName('prototype.__create__roles');
  User.disableRemoteMethodByName('prototype.__delete__roles');
  User.disableRemoteMethodByName('prototype.__link__roles');
  User.disableRemoteMethodByName('prototype.__unlink__roles');
  User.disableRemoteMethodByName('prototype.__findById__roles');
  User.disableRemoteMethodByName('prototype.__updateById__roles');
  User.disableRemoteMethodByName('prototype.__destroyById__roles');
  User.disableRemoteMethodByName('prototype.__exists__roles');

  /**
   * Add the user to the given role by name.
   *
   * @param {string} roleName
   * @param {Function} callback
   */
  User.prototype.addToRole = function(roleName, callback) {
    var error;
    var userId = this.id;
    Role.findOne(
      {
        where: {name: roleName},
      },
      function(err, role) {
        if (err) {
          return callback(err);
        }

        if (!role) {
          error = new Error('Role ' + roleName + ' not found.');
          error['http_code'] = 404;
          return callback(error);
        }

        RoleMapping.findOne(
          {
            where: {
              principalId: userId,
              roleId: role.id,
            },
          },
          function(err, roleMapping) {
            if (err) {
              return callback(err);
            }

            if (roleMapping) {
              return callback();
            }

            role.principals.create(
              {
                principalType: RoleMapping.USER,
                principalId: userId,
              },
              callback
            );
          }
        );
      }
    );
  };
  User.remoteMethod(
    'addToRole',
    {
      description: 'Add User to the named role',
      accessType: 'WRITE',
      isStatic: false,
      accepts: [
        {
          arg: 'roleName',
          type: 'string',
          required: true,
          description: 'Name of the role to add.',
          http: {
            source: 'path',
          },
        },
      ],
      http: {
        path: '/roles/:roleName',
        verb: 'put',
      },
    }
  );

  /**
   * Remove the user from the given role by name.
   *
   * @param {string} roleName
   * @param {Function} callback
   */
  User.prototype.removeFromRole = function(roleName, callback) {
    var error;
    var userId = this.id;
    Role.findOne(
      {
        where: {name: roleName},
      },
      function(err, role) {
        if (err) {
          return callback(err);
        }

        if (!role) {
          error = new Error('Role ' + roleName + ' not found.');
          error['http_code'] = 404;
          return callback(error);
        }

        RoleMapping.findOne(
          {
            where: {
              principalId: userId,
              roleId: role.id,
            },
          },
          function(err, roleMapping) {
            if (err) {
              return callback(err);
            }

            if (!roleMapping) {
              return callback();
            }

            roleMapping.destroy(callback);
          }
        );
      }
    );
  };
  User.remoteMethod(
    'removeFromRole',
    {
      description: 'Remove User to the named role',
      accessType: 'WRITE',
      isStatic: false,
      accepts: [
        {
          arg: 'roleName',
          type: 'string',
          required: true,
          description: 'Name of the role to remove.',
          http: {
            source: 'path',
          },
        },
      ],
      http: {
        path: '/roles/:roleName',
        verb: 'delete',
      },
    }
  );
};
