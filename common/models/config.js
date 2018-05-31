'use strict';

module.exports = function(Config) {
  Config.observe('before save', function updateMetadata(ctx, next) {
    // manage metadata property
    const d = new Date();
    const token = ctx.options && ctx.options.accessToken;
    const userId = token && token.userId;
    if (ctx.instance) {
      if (ctx.isNewInstance === true) {
        ctx.instance.metadata = {
          createDate: d,
          updateDate: d,
          createUser: userId,
          updateUser: userId
        };
        next();
      } else {
        Config.findById(ctx.instance.id,{ fields: { metadata: true } }, function(err, instance) {
          if (instance.metadata == null) {
            instance.metadata = {};
          }
          instance.metadata.updateDate = d;
          instance.metadata.updateUser = userId;
          ctx.instance.metadata = instance.metadata;
          next();
        });
      }
    } else {
      let metadata = ctx.currentInstance.metadata;
      if (metadata == null) {
        metadata = {}
      }
      metadata.updateDate = d;
      metadata.updateUser = userId;
      ctx.data.metadata = metadata;
      next();
    }
  });
  Config.validatesUniquenessOf('name',{ allowNull: false, ignoreCase: 'ignore', scopedTo: [ 'configType' ] });
};
