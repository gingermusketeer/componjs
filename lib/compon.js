var NotificationCenter = require('./notificationCenter.js');

var componentNotificationCenter = NotificationCenter.create();

module.exports = {
  create: function ComponentCreate(componentDef, scope) {
    var privateNotificationCenter;
    var subscribedChannels = {};
    var notificationCenter = componentNotificationCenter;
    scope = scope || {};
    scope.subscribe = function subscribe (channelName, handler) {
      subscribedChannels[channelName] = handler;
      notificationCenter.subscribe(channelName, handler);
    };

    scope.publish = notificationCenter.publish;

    scope.publishOnceSubscribed = notificationCenter.publishOnceSubscribed;

    return {
      _scope: scope,
      register: function () {
        componentDef.call(scope);
      },
      unregister: function () {
        for(var channel in subscribedChannels) {
          if(subscribedChannels.hasOwnProperty(channel)) {
            notificationCenter.unsubscribe(channel, subscribedChannels[channel]);
          }
        }
      },
      privatise: function () {
        privateNotificationCenter = NotificationCenter.create();
        notificationCenter = privateNotificationCenter;
      },
      unprivatise: function () {
        privateNotificationCenter = null;
        notificationCenter = componentNotificationCenter;
      }
    };
  },
  mixin: function ComponentMixin(component) {
    // pull all the objects assigned to scope and add them to the new components scope
    component.register();
    var scope = component._scope;
    return {
      create: function (componentDef) {
        return module.exports.create(componentDef, scope);
      }
    };
  },
  is: function is(obj) {
    return {
      aComponent: (obj.hasOwnProperty("register") && obj.hasOwnProperty("unregister") && obj.hasOwnProperty('_scope'))
    }
  }
};
