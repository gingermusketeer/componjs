// Handles message passing system for the app.

var asyncRunner = require('./asyncRunner');

// The main notificationCenter for the app.
var mainNotificationCenter;

// Default configuration for all channels.
var defaultConfig = {
  // TODO: Perhaps isAsync should be removed.
  isAsync: true
};


module.exports = {

  setMainNotificationCenter: function(notificationCenter) {
    mainNotificationCenter = notificationCenter;
  },
  getMainNotificationCenter: function() { return mainNotificationCenter; },
  create: function() {
    // Create a new notification center.

    // privates
    // configures the channel with either the config passed in or the
    // default configuration.
    function configureChannel(channel, config) {
      config = config || defaultConfig;
      if(channels[channel]) {
        throw new Error("cannot configure channel that all ready exists");
      } else {
        channels[channel] = {
          config: config,
          subscribers: []
        };
      }
    }

    // Where the channels->handler binding is stored.
    var channels = {};

    //

    var delayedNotifications = {};

    var notificationCenter = {
      configureChannel: configureChannel,
      subscribe: function(channel, callback) {
        console.log("adding subscriber on channel: " + channel);

        if( channels[channel]) {
          channels[channel].subscribers.push(callback);
        } else {
          configureChannel(channel);
          channels[channel].subscribers = [callback];
        }
        if(delayedNotifications[channel]) {
          for (var i = delayedNotifications[channel].length - 1; i >= 0; i--) {
            notificationCenter.publish.apply(null, delayedNotifications[channel][i]);
            delete delayedNotifications[channel][i];
          }
          delete delayedNotifications[channel];
        }
      },
      unsubscribe: function(channel, callback) {
        var subscribers = channels[channel].subscribers;
        var i = subscribers.indexOf(callback);

        subscribers.splice(i, 1); // remove only one
      },
      publish: function(channel, args, noSubscriberCallback) {
        console.log("[PUBLISH] | " + channel + " | " );
        if(channels[channel] && channels[channel].subscribers.length !== 0) {
          channels[channel].subscribers.forEach(function(callback) {
            if(channels[channel].config.isAsync) {
              asyncRunner(function() { callback(args); } );
            } else {
              callback(args);
            }
          });
          if(!channels[channel].config.isAsync && args['_done']) {
            args['_done']();
          }
        } else {
          console.log('unknown channel: ' + channel);
          if(noSubscriberCallback) { noSubscriberCallback(); }
        }
      },
      publishOnceSubscribed: function(channel, args, noSubscriberCallback) {
        if(!delayedNotifications[channel]) {
          delayedNotifications[channel] = [];
        }
        delayedNotifications[channel].push([channel, args, noSubscriberCallback]);
      }
    };
    // Return the notification center object
    return notificationCenter;
  }
};
