Titanium Appcelerator Alloy TiParseTestApp
===

Sample application demonstrating the integration on Parse Javascript API with Titanium Appcelerator.

This example integrates Facebook account creation and the updating of the user account with information from the associated facebook account.

###This utilizes the Parse-Appcelerator JavaScript Hack of Parse JavaScript SDK Version: 1.2.18

The challenge continues to make Parse work with Appcelerator but I have made so adjustment to the original hack I created to get the solution more fully integrated with Appcelerator and include Facebook integration in the solution.

It is the same basic premise as the original solution where we override existing objects in the parse library to leverage the Appcelerator HTTPClient and the Appcelerator Facebook integration. I have tested this solution with the integration IOS support for Facebook single sign on and with old way where you get the web UI for the login prompt.

###Edits to the Parse Javascript API

 Add this to line 1348 of Parse JavaScript SDK Version: 1.2.18
 
      // Import Parse's local copy of underscore.
      if (Titanium !== "undefined") {
        console.log("Using titanium");
 
        Parse._ = exports._.noConflict();
        exports.Parse = Parse;
      } else
     
     
 Replace line 8576 of Parse JavaScript SDK Version: 1.2.18
 
     Parse.User._registerAuthenticationProvider(FB.provider);     
     
I will create a full example with a git repo soon but for now, here is how you use the library in your application

    require("lib/ti.parse_mine")({
      facebookAppId : 'YOUR-FACEBOOK-ID',
      applicationId : 'PARSE-APP-ID',
      javascriptkey : 'PARSE-JAVASCRIPT-KEY'
    });

###Facebook Object

If you pass in teh facebook id, the library will instaniate the Titanium Facebook object, which you must also include in your `tiapp.xml`. The Facebook object is available globally through the object `TiFacebook`

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
