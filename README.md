Titanium Appcelerator Alloy TiParseTestApp
===

![Alt text](Screen Shot 2014-05-24 at 8.52.34 PM.png?raw=true "Optional Title")

Sample application demonstrating the integration on Parse Javascript API with Titanium Appcelerator.

This example integrates Facebook account creation and the updating of the user account with information from the associated facebook account.

###This utilizes the Parse-Appcelerator JavaScript Hack of Parse JavaScript SDK Version: 1.2.18

The challenge continues to make Parse work with Appcelerator but I have made so adjustment to the original hack I created to get the solution more fully integrated with Appcelerator and include Facebook integration in the solution.

It is the same basic premise as the original solution where we override existing objects in the parse library to leverage the Appcelerator HTTPClient and the Appcelerator Facebook integration. I have tested this solution with the integration IOS support for Facebook single sign on and with old way where you get the web UI for the login prompt.

###Edits to the Parse Javascript API

 Add this to line 1348 of Parse JavaScript SDK Version: 1.2.18
 
```JavaScript
// Import Parse's local copy of underscore.
if (Titanium !== "undefined") {
  console.log("Using titanium");

  Parse._ = exports._.noConflict();
  exports.Parse = Parse;
} else
```
     
 Replace line 8576 of Parse JavaScript SDK Version: 1.2.18
 
```JavaScript
Parse.User._registerAuthenticationProvider(FB.provider);     
```

I will create a full example with a git repo soon but for now, here is how you use the library in your application

```JavaScript
require("lib/ti.parse_mine")({
  facebookAppId : 'YOUR-FACEBOOK-ID',
  applicationId : 'PARSE-APP-ID',
  javascriptkey : 'PARSE-JAVASCRIPT-KEY'
});
```
###Accessing Titanium Facebook Object

If you pass in teh facebook id, the library will instaniate the Titanium Facebook object, which you must also include in your `tiapp.xml`. The Facebook object is available globally through the object `TiFacebook`

###Loggin In A User

###Uploading a File
File uploading is a little trick on Appcelerator because the javascript library cannot understand the filesystem

The way thus problem is addressed is by sending the file as a base64 string and then Parse will upload the file just fine.

An example here, assume I have an image from the camera in variable `imageFromCamera` that I want to save to Parse

```JavaScript
// see code in next section
var photoService = require('photoService');
photoService.savePhoto({
   fileName : 'A New Image',
   media : imageFromCamera
}).then(function(_result){
  Ti.API.debug('_result: ' + JSON.stringify(_result, null, 2));
  alert('File Saved');
}, function(_error){ 
  alert("Error: " + error.code + " " + error.message);
});
```

We added some extra functionality in the photoService library. Since parse needs the file to be associated with an object, we create the object and associated the file with it all in one method.

We are using the Q promises library to keep the code manageble and avoid callback hell.

```JavaScript
/**
 * 
 * @param {String} _options.fileName
 * @param {TiBlob} _options.media
 */
exports.savePhoto = function(_options) {
  var photoSource;
  var deferred = Q.defer();
  
  // CONVERT IMAGE SO PARSE IS HAPPY!!
  var b64 = Titanium.Utils.base64encode(_options.media);

  var file = new Parse.File(_options.fileName || "myfile.jpg", {
    base64 : b64.getText()
  });

  file.save().then(function(_result) {
    // The file has been saved to Parse.
    Ti.API.debug('_result: ' + JSON.stringify(_result, null, 2));
    
    // create object to associate file with
    var testObject = new Parse.Object("TestObject");
    
    // add file to object
    testObject.set("aFile", file);
    
    // save everything.. returns another promise
    return testObject.save();
  }).then(function(_result2) {
    Ti.API.info('_result2: ' + JSON.stringify(_result2, null, 2));
    deferred.resolve({
      success : true,
      model : _result2
    });
  }, function(error) {
    // The file either could not be read, or could not be saved to Parse.
    alert("Error: " + error.code + " " + error.message);
    Ti.API.error(JSON.stringify(error, null, 2));
    deferred.reject({
      error : error,
      msg : msg
    });
  });

  return deferred.promise;

};
```
Full Source code of Parse API Hack:
   - [Seperate GIST](http://bit.ly/1p5YTwI)
   - [In this project: `lib/ti.parse_mine.js`](https://github.com/aaronksaunders/TiParseTestApp/blob/master/app/lib/ti.parse_mine.js)

Enjoy

Aaron K. Saunders, Clearly Innovative Inc
   - www.clearlyinnovative.com
   - [blog.clearlyinnovative.com](blog.clearlyinnovative.com)


Copyright (c) 2012-2014 Aaron K. Saunders

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
