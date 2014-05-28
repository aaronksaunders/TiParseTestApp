var Q = require('q');

/**
 * 
 */
exports.getPhoto = function() {
  var photoSource;
  var deferred = Q.defer();

  Ti.API.debug('Ti.Media.isCameraSupported ' + Ti.Media.isCameraSupported);

  if (!Ti.Media.isCameraSupported) {
    photoSource = 'openPhotoGallery';
  } else {
    photoSource = 'showCamera';
  }

  Titanium.Media[photoSource]({
    success : function(event) {
      // event.media
      deferred.resolve({
        success : true,
        media : event.media
      });
    },
    cancel : function() {
      // called when user cancels taking a picture
      deferred.reject({
        success : false,
        msg : 'User Cancelled'
      });
    },
    error : function(error) {
      // display alert on error
      var msg = "";
      if (error.code == Titanium.Media.NO_CAMERA) {
        msg = 'Please run this test on device';
      } else {
        msg = 'Unexpected error: ' + error.code;
      }
      deferred.reject({
        error : error,
        msg : msg
      });
    },
    saveToPhotoGallery : false,
    allowEditing : true,
    // only allow for photos, no video
    mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
  });

  return deferred.promise;

};
