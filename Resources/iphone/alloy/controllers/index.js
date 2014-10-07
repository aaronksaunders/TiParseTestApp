function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function userIsNotLoggedIn() {
        $.loginController = Alloy.createController("login", {
            parentController: $,
            reset: true,
            loginSuccess: function(_user) {
                userIsLoggedIn(_user);
                setTimeout(function() {
                    $.loginController.close();
                }, 300);
            }
        });
        $.loginController.open(true);
    }
    function userIsLoggedIn(_currentUser) {
        if ($.indexIsNotOpened) {
            $.getView().open();
            $.indexIsNotOpened = false;
        }
        if (_currentUser && false) {
            Alloy.Globals.currentUser = _currentUser;
            console.log(JSON.stringify(_currentUser, null, 2));
            $.fb_un.text = _currentUser.get("fb_username") || "No Value: FB username";
            $.un.text = _currentUser.get("username");
            $.fn.text = _currentUser.get("first_name") || "No Value: first name";
            $.ln.text = _currentUser.get("last_name") || "No Value: last name";
            $.email.text = _currentUser.get("email") || "No Value: email";
            $.phone.text = _currentUser.get("phone") || "No Value: phone number";
            $.isFB.text = _currentUser.get("authData") ? "Facebook" : "Not Facebook";
        }
        loadSomeData();
    }
    function loadMoreBtnClicked() {
        alert("not implemented yet");
    }
    function loadSomeData() {
        var testObjects = Parse.Object.extend("TestObject");
        var query = new Parse.Query(testObjects);
        query.find({
            success: function(results) {
                alert("Successfully retrieved " + results.length + " testObjects.");
                createListView(results);
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
    function createListView(_data) {
        $.section.deleteItemsAt(0, $.section.items.length);
        var items = [];
        for (var i in _data) items.push({
            template: "template1",
            textLabel: {
                text: _data[i].get("foo") || "Missing"
            },
            pic: {
                image: _data[i].get("aFile").url()
            }
        });
        $.section.setItems(items);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.__alloyId0 = Ti.UI.createWindow({
        backgroundColor: "white",
        exitOnClose: true,
        id: "__alloyId0"
    });
    $.__views.cameraButton = Ti.UI.createButton({
        top: "6dp",
        width: "100dp",
        height: "36dp",
        font: {
            fontSize: "13dp"
        },
        border: 1,
        borderColor: "gray",
        title: "Camera",
        id: "cameraButton"
    });
    $.__views.__alloyId0.rightNavButton = $.__views.cameraButton;
    $.__views.indexContainer = Ti.UI.createView({
        id: "indexContainer",
        layout: "vertical"
    });
    $.__views.__alloyId0.add($.__views.indexContainer);
    $.__views.logoutBtn = Ti.UI.createButton({
        top: "6dp",
        width: "100dp",
        height: "36dp",
        font: {
            fontSize: "13dp"
        },
        border: 1,
        borderColor: "gray",
        title: "Logout",
        id: "logoutBtn"
    });
    $.__views.indexContainer.add($.__views.logoutBtn);
    $.__views.userInformaton = Ti.UI.createView({
        id: "userInformaton",
        layout: "vertical",
        top: "5dp"
    });
    $.__views.indexContainer.add($.__views.userInformaton);
    $.__views.un = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "18sp"
        },
        textAlign: "left",
        id: "un"
    });
    $.__views.userInformaton.add($.__views.un);
    $.__views.fb_un = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "18sp"
        },
        textAlign: "left",
        id: "fb_un"
    });
    $.__views.userInformaton.add($.__views.fb_un);
    $.__views.fn = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "18sp"
        },
        textAlign: "left",
        id: "fn"
    });
    $.__views.userInformaton.add($.__views.fn);
    $.__views.ln = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "18sp"
        },
        textAlign: "left",
        id: "ln"
    });
    $.__views.userInformaton.add($.__views.ln);
    $.__views.email = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "18sp"
        },
        textAlign: "left",
        id: "email"
    });
    $.__views.userInformaton.add($.__views.email);
    $.__views.phone = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "18sp"
        },
        textAlign: "left",
        id: "phone"
    });
    $.__views.userInformaton.add($.__views.phone);
    $.__views.isFB = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "18sp"
        },
        textAlign: "left",
        id: "isFB"
    });
    $.__views.userInformaton.add($.__views.isFB);
    var __alloyId2 = {};
    var __alloyId5 = [];
    var __alloyId6 = {
        type: "Ti.UI.Button",
        properties: {
            top: "6dp",
            width: "100dp",
            height: "36dp",
            font: {
                fontSize: "13dp"
            },
            border: 1,
            borderColor: "gray",
            title: "Load More"
        },
        events: {
            click: loadMoreBtnClicked
        }
    };
    __alloyId5.push(__alloyId6);
    var __alloyId4 = {
        properties: {
            name: "buttonItem",
            height: Ti.UI.SIZE
        },
        childTemplates: __alloyId5
    };
    __alloyId2["buttonItem"] = __alloyId4;
    var __alloyId8 = [];
    var __alloyId9 = {
        type: "Ti.UI.ImageView",
        bindId: "pic",
        properties: {
            preventDefaultImage: true,
            width: "50dp",
            height: "50dp",
            left: 0,
            bindId: "pic"
        }
    };
    __alloyId8.push(__alloyId9);
    var __alloyId10 = {
        type: "Ti.UI.View",
        childTemplates: function() {
            var __alloyId11 = [];
            var __alloyId12 = {
                type: "Ti.UI.Label",
                bindId: "textLabel",
                properties: {
                    width: Ti.UI.SIZE,
                    height: Ti.UI.SIZE,
                    color: "#000",
                    font: {
                        fontSize: "18sp"
                    },
                    textAlign: "left",
                    left: "60dp",
                    top: 0,
                    bindId: "textLabel"
                }
            };
            __alloyId11.push(__alloyId12);
            return __alloyId11;
        }(),
        properties: {}
    };
    __alloyId8.push(__alloyId10);
    var __alloyId7 = {
        properties: {
            height: "56dp",
            name: "template1"
        },
        childTemplates: __alloyId8
    };
    __alloyId2["template1"] = __alloyId7;
    var __alloyId14 = [];
    $.__views.__alloyId15 = {
        template: "template1",
        properties: {
            id: "__alloyId15"
        }
    };
    __alloyId14.push($.__views.__alloyId15);
    $.__views.section = Ti.UI.createListSection({
        id: "section"
    });
    $.__views.section.items = __alloyId14;
    var __alloyId16 = [];
    __alloyId16.push($.__views.section);
    $.__views.list = Ti.UI.createListView({
        sections: __alloyId16,
        templates: __alloyId2,
        id: "list",
        defaultItemTemplate: "template1"
    });
    $.__views.__alloyId0.add($.__views.list);
    $.__views.mainWindow = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId0,
        id: "mainWindow"
    });
    $.__views.mainWindow && $.addTopLevelView($.__views.mainWindow);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("ti.parse_mine")(Alloy.CFG.parseOptions);
    $.logoutBtn.addEventListener("click", function() {
        Parse.User.logOut();
        console.log("User Just Logged Out");
        userIsNotLoggedIn();
    });
    $.cameraButton.addEventListener("click", function() {
        processCameraClick();
    });
    $.loginSuccessAction = function(_options) {
        Ti.API.info("logged in user information");
        Ti.API.info(JSON.stringify(_options.model, null, 2));
        $.mainController.initialize();
        Alloy.Globals.currentUser = _options.model;
        $.loginController && $.loginController.close();
    };
    var currentUser = Parse.User.current();
    $.indexContainer.top = (Alloy.Globals.iOS7 ? 40 : 0) + "dp";
    $.indexIsNotOpened = true;
    if (currentUser) userIsLoggedIn(currentUser); else {
        console.log("userIsNotLoggedIn");
        userIsNotLoggedIn();
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;