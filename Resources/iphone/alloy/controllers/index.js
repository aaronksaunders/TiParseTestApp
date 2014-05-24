function Controller() {
    function userIsNotLoggedIn() {
        $.loginController = Alloy.createController("login", {
            parentController: $,
            reset: true
        });
        $.loginController.open(true);
    }
    function userIsLoggedIn(_currentUser) {
        if (_currentUser) {
            Alloy.Globals.currentUser = _currentUser;
            console.log(JSON.stringify(_currentUser, null, 2));
            debugger;
            var Farmers = Parse.Object.extend("farmers");
            var query = new Parse.Query(Farmers);
            query.find().then(function() {
                debugger;
            }, function() {
                debugger;
            });
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("ti.parse_mine")({
        facebookAppId: "175961759252181",
        applicationId: "7w2l6VzIOcI7XEqENkuswSk3J47i0D7KSesexRVL",
        javascriptkey: "cjqeg1nBDkKwfsU28U8iHmPyIY8jBGbwc0ElYkek"
    });
    $.loginSuccessAction = function(_options) {
        Ti.API.info("logged in user information");
        Ti.API.info(JSON.stringify(_options.model, null, 2));
        $.mainController.initialize();
        Alloy.Globals.currentUser = _options.model;
        $.loginController && $.loginController.close();
    };
    var currentUser = Parse.User.current();
    if (true === currentUser) userIsLoggedIn(currentUser); else {
        console.log("userIsNotLoggedIn");
        userIsNotLoggedIn();
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;