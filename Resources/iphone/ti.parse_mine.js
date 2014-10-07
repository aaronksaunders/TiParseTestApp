var TiParse = function(options) {
    TiFacebook = require("facebook");
    TiFacebook.appid = options.facebookAppId;
    require("parse-1.3.0");
    Ti.API.info("PARSE 1.3");
    FB = {
        provider: {
            authenticate: function(options) {
                var self = this;
                TiFacebook.forceDialogAuth = false;
                TiFacebook.authorize();
                TiFacebook.addEventListener("login", function(response) {
                    response.success ? options.success && options.success(self, {
                        id: Alloy.Globals.isAndroid ? JSON.parse(response.data).id : response.data.id,
                        access_token: TiFacebook.accessToken,
                        expiration_date: new Date(TiFacebook.expirationDate).toJSON()
                    }) : options.error && options.error(self, response);
                });
            },
            restoreAuthentication: function(authData) {
                var authResponse;
                authResponse = authData ? {
                    userID: authData.id,
                    accessToken: authData.access_token,
                    expiresIn: (Parse._parseDate(authData.expiration_date).getTime() - new Date().getTime()) / 1e3
                } : {
                    userID: null,
                    accessToken: null,
                    expiresIn: null
                };
                authData || TiFacebook.logout();
                return true;
            },
            getAuthType: function() {
                return "facebook";
            },
            deauthenticate: function() {
                this.restoreAuthentication(null);
            }
        },
        init: function() {
            Ti.API.debug("called FB.init()");
        },
        login: function() {
            Ti.API.debug("called FB.login()");
        },
        logout: function() {
            Ti.API.debug("called FB.logout()");
        }
    };
    Parse.localStorage = {
        getItem: function(key) {
            return Ti.App.Properties.getObject(Parse.localStorage.fixKey(key));
        },
        setItem: function(key, value) {
            return Ti.App.Properties.setObject(Parse.localStorage.fixKey(key), value);
        },
        removeItem: function(key) {
            return Ti.App.Properties.removeProperty(Parse.localStorage.fixKey(key));
        },
        fixKey: function(key) {
            return key.split("/").join("");
        }
    };
    Parse.initialize(options.applicationId, options.javascriptkey);
    Parse._ajax = function(method, url, data, success, error) {
        var options = {
            success: success,
            error: error
        };
        var promise = new Parse.Promise();
        var handled = !1;
        var xhr = Ti.Network.createHTTPClient({
            timeout: 5e3,
            autoEncodeUrl: false
        });
        xhr.onload = function() {
            Ti.API.info("xhr.onload invoked, request successful:::");
            if (handled) return;
            handled = !0;
            if (this.status >= 200 && 300 > this.status) {
                var response;
                try {
                    response = eval("(" + this.responseText + ")");
                } catch (e) {
                    promise.reject(e);
                }
                response && promise.resolve(response, this.status, this);
            } else promise.reject(this);
        };
        xhr.onerror = function() {
            Ti.API.info("xhr.onerror invoked, request failed, and promise rejected:::");
            promise.reject(this);
        };
        xhr.open(method, url, !0);
        xhr.setRequestHeader("X-Parse-Application-Id", "***REMOVED***");
        xhr.setRequestHeader("X-Parse-REST-API-Key", "pw8vre2YZE0dPYCWYR1VoT5HxuYHzbR4xRSCHsqm");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
        return promise._thenRunCallbacks(options);
    };
    TiFacebook.appid && Parse.FacebookUtils.init({
        appId: TiFacebook.appid,
        status: false,
        cookie: true,
        xfbml: true
    });
};

module.exports = TiParse;