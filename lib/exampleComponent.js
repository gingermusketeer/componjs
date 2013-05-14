var Component = require('./component.js');

module.exports = Component.create(function(){
  var component = this;
  this.subscribe('some_channel', function (args) {
    if(args.one) {
      component.publish('channel_one', "one");
    } else {
      component.publish('channel', "unknown");
    }
  });
  publish("something", 1);
});
