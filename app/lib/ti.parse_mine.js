/**
 * twitter: @aaronksaunders
 *
 * See more Appcelerator Information on Company Blog
 *
 * blog.clearlyinnovative.com
 *
 */

/**
 * Edits to the parse library to work with this helper file
 *
 * Add this to line 1348
 *<pre>
 * // Import Parse's local copy of underscore.
 *    if (Titanium !== "undefined") {
 *      console.log("Using titanium");
 *
 *      Parse._ = exports._.noConflict();
 *      exports.Parse = Parse;
 *    } else
 *</pre>
 *
 * Replace line 8576
 * <pre>
 * Parse.User._registerAuthenticationProvider(FB.provider);
 * </pre>
 */

var TiParse = function(options) {
	
	
	
	
  TiFacebook = require('facebook');
  TiFacebook.appid = options.facebookAppId;

  // UPDATED TO LATEST PARSE LIBRARY version parse-1.2.18
  require("parse-1.3.0");
Ti.API.info("PARSE 1.3");
  //
  // Override the Facebook object on Appcelerator
  //
  // Create the provider and the other methods the Parse Library is looking for
  //
  FB = {
    provider : {

      authenticate : function(options) {
        var self = this;
        TiFacebook.forceDialogAuth = false;
        TiFacebook.authorize();

        TiFacebook.addEventListener('login', function(response) {

          if (response.success) {
            if (options.success) {
              options.success(self, {
                id : Alloy.Globals.isAndroid?JSON.parse(response.data).id:response.data.id,
                access_token : TiFacebook.accessToken,
                expiration_date : (new Date(TiFacebook.expirationDate)).toJSON()
              });

            }
          } else {
            if (options.error) {
              options.error(self, response);
            }
          }
        });

      },
      restoreAuthentication : function(authData) {
        
        var authResponse;
        if (authData) {
          authResponse = {
            userID : authData.id,
            accessToken : authData.access_token,
            expiresIn : (Parse._parseDate(authData.expiration_date).getTime() - (new Date()).getTime()) / 1000
          };
        } else {
          authResponse = {
            userID : null,
            accessToken : null,
            expiresIn : null
          };
        }
        //FB.Auth.setAuthResponse(authResponse);
        if (!authData) {
          TiFacebook.logout();
        }
        return true;
      },
      getAuthType : function() {
        return "facebook";
      },
      deauthenticate : function() {
        this.restoreAuthentication(null);
      }
    },
    init : function() {
      Ti.API.debug("called FB.init()");
    },
    login : function() {
      Ti.API.debug("called FB.login()");
    },
    logout : function() {
      Ti.API.debug("called FB.logout()");
    }
  };

  /**
   * over write the local storage so it works on Appcelerator
   */
  Parse.localStorage = {
    getItem : function(key) {
      return Ti.App.Properties.getObject(Parse.localStorage.fixKey(key));
    },
    setItem : function(key, value) {
      return Ti.App.Properties.setObject(Parse.localStorage.fixKey(key), value);
    },
    removeItem : function(key, value) {
      return Ti.App.Properties.removeProperty(Parse.localStorage.fixKey(key));
    },
    //Fix Parse Keys. Parse uses a Key containing slashes "/". This is invalid for Titanium Android
    //We'll replace those slashes with underscores ""
    fixKey : function(key) {
      return key.split("/").join("");
    }
  };

  //
  // Enter appropriate parameters for initializing Parse
  //
  // options.applicationId, options.javascriptkey);
  //
Parse.initialize(options.applicationId, options.javascriptkey);
  /**
   * Over write the _ajax function to use titanium httpclient
   *
   * @TODO Still looking for way to clean this up better
   *
   * @param {Object} method
   * @param {Object} url
   * @param {Object} data
   * @param {Object} success
   * @param {Object} error
   */
  Parse._ajax = function(method, url, data, success, error) {

    var options = {
      success : success,
      error : error
    };

    var promise = new Parse.Promise();
    var handled = !1;
    var xhr = Ti.Network.createHTTPClient({
      timeout : 5e3,
      autoEncodeUrl: false
    });
    
    
  xhr.onload = function() {
        Ti.API.info("xhr.onload invoked, request successful:::");
        if (handled) {
            return;
        }
        handled = !0;
        if (this.status >= 200 && 300 > this.status) {
            var response;
            try {
                response = eval('('+this.responseText+')');
            } catch (e) {
                promise.reject(e);
            }
            response && promise.resolve(response, this.status, this);
        } else {
            promise.reject(this);
        }
    };

    xhr.onerror = function(){
        Ti.API.info("xhr.onerror invoked, request failed, and promise rejected:::");
        promise.reject(this);
    };
    
    xhr.open(method, url, !0);
    xhr.setRequestHeader("X-Parse-Application-Id", 'fI7U1dRKkDeZDRKjqOCer70HMLXtpuN7g5yrUDz8');
	xhr.setRequestHeader("X-Parse-REST-API-Key", "pw8vre2YZE0dPYCWYR1VoT5HxuYHzbR4xRSCHsqm");
//	xhr.setRequestHeader("Accept","application/json");
    //xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
    return promise._thenRunCallbacks(options);
  };
  
  

  //
  // IF the appid was set for facebook then initialize facebook. if you are going
  // to use Facebook, set the appid at the top of this file
  //
  if (TiFacebook.appid) {
    Parse.FacebookUtils.init({
      appId : TiFacebook.appid, // Facebook App ID
//      channelUrl : '//www.clearlyinnovative.com/channel.html', // Channel File - USE YOUR DOMAIN HERE !!
      status : false, // check login status
      cookie : true, // enable cookies to allow Parse to access the session
      xfbml : true // parse XFBML
    });
  }
};
module.exports = TiParse;
