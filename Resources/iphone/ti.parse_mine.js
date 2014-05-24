var TiParse = function(options) {
    debugger;
    TiFacebook = require("facebook");
    TiFacebook.appid = options.facebookAppId;
    require("parse-1.2.18");
    FB = {
        provider: {
            authenticate: function(options) {
                var self = this;
                TiFacebook.forceDialogAuth = false;
                TiFacebook.authorize();
                TiFacebook.addEventListener("login", function(response) {
                    response.success ? options.success && options.success(self, {
                        id: response.data.id,
                        access_token: TiFacebook.accessToken,
                        expiration_date: new Date(TiFacebook.expirationDate).toJSON()
                    }) : options.error && options.error(self, response);
                });
            },
            restoreAuthentication: function(authData) {
                debugger;
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
            TiFacebook.appid = "***REMOVED***";
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
            timeout: 5e3
        });
        xhr.onreadystatechange = function() {
            if (4 === xhr.readyState) {
                if (handled) return;
                handled = !0;
                if (xhr.status >= 200 && 300 > xhr.status) {
                    var response;
                    try {
                        response = JSON.parse(xhr.responseText);
                    } catch (e) {
                        promise.reject(e);
                    }
                    response && promise.resolve(response, xhr.status, xhr);
                } else promise.reject(xhr);
            }
        };
        xhr.open(method, url, !0);
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(data);
        return promise._thenRunCallbacks(options);
    };
    TiFacebook.appid && Parse.FacebookUtils.init({
        appId: TiFacebook.appid,
        channelUrl: "//www.clearlyinnovative.com/channel.html",
        status: false,
        cookie: true,
        xfbml: true
    });
};

module.exports = TiParse;