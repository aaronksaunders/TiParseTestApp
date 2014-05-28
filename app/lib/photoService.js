var Q = require('q');

/**
 * 
 * @param {String} _options.fileName
 * @param {TiBlob} _options.media
 */
exports.savePhoto = function(_options) {
  var photoSource;
  var deferred = Q.defer();
  var b64 = Titanium.Utils.base64encode(_options.media);

  var file = new Parse.File(_options.fileName || "myfile.jpg", {
    base64 : b64.getText()
  });

  file.save().then(function(_result) {
    // The file has been saved to Parse.
    //Ti.API.debug('_result: ' + JSON.stringify(_result, null, 2));
    var testObject = new Parse.Object("TestObject");
    testObject.set("aFile", file);
    return testObject.save();
  }).then(function(_result2) {
   // Ti.API.info('_result2: ' + JSON.stringify(_result2, null, 2));
    deferred.resolve({
      success : true,
      model : _result2
    });
  }, function(error) {
    // The file either could not be read, or could not be saved to Parse.
    alert("Error: " + error.code + " " + error.message);
    Ti.API.info(JSON.stringify(error, null, 2));
    deferred.reject({
      error : error,
      msg : msg
    });
  });

  return deferred.promise;

};
