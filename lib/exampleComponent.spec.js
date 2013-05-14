
var exampleComponent = require('exampleComponent.js');
var testComponent = require('testComponent.js');

module.exports = Component.mixin(testComponent).create(function() {
  describe("exampleComponent", function() {
    var comms;
    beforeEach(function(){
      comms = exampleComponent.registerForTesting();
    });

});
