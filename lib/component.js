var NotificationCenter = require('./notificationCenter.js');

var componentNotificationCenter = NotificationCenter.create();

module.exports = {
  create: function ComponentCreate(componentDef, scope) {

    var subscribedChannels = {};
    scope = scope || {};
    scope.subscribe = function subscribe (channelName, handler) {
      subscribedChannels[channelName] = handler;
      componentNotificationCenter.subscribe(channelName, handler);
    };

    scope.publish = componentNotificationCenter.publish;

    return {
      _scope: scope,
      register: function () {
        componentDef.call(scope);
      },
      unregister: function () {
        for(var channel in subscribedChannels) {
          if(subscribedChannels.hasOwnProperty(channel)) {
            componentNotificationCenter.unSubscribe(channel, subscribedChannels[channel]);
          }
        }
      }
    };
  },
  mixin: function ComponentMixin(component) {
    // pull all the objects assigned to scope and add them to the new components scope
    component.register();
    var scope = component._scope;
    console.log(component);
    return {
      create: function (componentDef) {
        return module.exports.create(componentDef, scope);
      }
    };
  }
};
