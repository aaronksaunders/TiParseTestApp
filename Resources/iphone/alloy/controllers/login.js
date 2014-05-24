function Controller() {
    function doFacebookLoginBtnClicked() {}
    function doLoginBtnClicked() {}
    function doCreateAcctBtnClicked() {
        if ($.acct_password.value !== $.acct_password_confirmation.value) {
            alert("Please re-enter information");
            return;
        }
        ({
            first_name: $.acct_fname.value,
            last_name: $.acct_lname.value,
            username: $.acct_email.value,
            email: $.acct_email.value,
            password: $.acct_password.value,
            password_confirmation: $.acct_password_confirmation.value
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "login";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createScrollView({
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.SIZE,
        layout: "vertical",
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.loginView = Ti.UI.createView({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: "40dp",
        layout: "vertical",
        borderColor: "transparent",
        id: "loginView"
    });
    $.__views.__alloyId0.add($.__views.loginView);
    $.__views.loginText = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        textAlign: "center",
        text: "Login to Parse",
        id: "loginText"
    });
    $.__views.loginView.add($.__views.loginText);
    $.__views.lvContainer = Ti.UI.createView({
        top: "20dp",
        width: "280dp",
        height: Ti.UI.SIZE,
        layout: "vertical",
        borderColor: "orange",
        borderWidth: 0,
        id: "lvContainer"
    });
    $.__views.loginView.add($.__views.lvContainer);
    $.__views.email = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        borderColor: "gray",
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        top: "6dp",
        left: "4dp",
        bottom: "2dp",
        right: "4dp",
        paddingLeft: "4dp",
        backgroundColor: "white",
        color: "black",
        width: "260dp",
        height: "36dp",
        border: 1,
        id: "email"
    });
    $.__views.lvContainer.add($.__views.email);
    $.__views.password = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        borderColor: "gray",
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        top: "6dp",
        left: "4dp",
        bottom: "2dp",
        right: "4dp",
        paddingLeft: "4dp",
        backgroundColor: "white",
        color: "black",
        width: "260dp",
        height: "36dp",
        border: 1,
        id: "password"
    });
    $.__views.lvContainer.add($.__views.password);
    $.__views.__alloyId1 = Ti.UI.createView({
        top: "10dp",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        layout: "horizontal",
        id: "__alloyId1"
    });
    $.__views.lvContainer.add($.__views.__alloyId1);
    $.__views.doLoginBtn = Ti.UI.createButton({
        top: "6dp",
        width: "100dp",
        height: "36dp",
        font: {
            fontSize: "13dp"
        },
        border: 1,
        borderColor: "gray",
        id: "doLoginBtn",
        title: "Login"
    });
    $.__views.__alloyId1.add($.__views.doLoginBtn);
    $.__views.doFacebookLoginBtn = Ti.UI.createButton({
        top: "6dp",
        width: "120dp",
        height: "36dp",
        font: {
            fontSize: "13dp"
        },
        border: 1,
        borderColor: "gray",
        left: "15dp",
        id: "doFacebookLoginBtn",
        title: "Facebook Connect"
    });
    $.__views.__alloyId1.add($.__views.doFacebookLoginBtn);
    $.__views.createAcctView = Ti.UI.createView({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        id: "createAcctView"
    });
    $.__views.__alloyId0.add($.__views.createAcctView);
    $.__views.accountText = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        textAlign: "center",
        text: "Create Parse Account",
        id: "accountText"
    });
    $.__views.createAcctView.add($.__views.accountText);
    $.__views.cavContainer = Ti.UI.createView({
        top: "20dp",
        width: "280dp",
        height: Ti.UI.SIZE,
        layout: "vertical",
        id: "cavContainer"
    });
    $.__views.createAcctView.add($.__views.cavContainer);
    $.__views.acct_fname = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        borderColor: "gray",
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        top: "6dp",
        left: "4dp",
        bottom: "2dp",
        right: "4dp",
        paddingLeft: "4dp",
        backgroundColor: "white",
        color: "black",
        width: "260dp",
        height: "36dp",
        border: 1,
        hintText: "first name",
        id: "acct_fname"
    });
    $.__views.cavContainer.add($.__views.acct_fname);
    $.__views.acct_lname = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        borderColor: "gray",
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        top: "6dp",
        left: "4dp",
        bottom: "2dp",
        right: "4dp",
        paddingLeft: "4dp",
        backgroundColor: "white",
        color: "black",
        width: "260dp",
        height: "36dp",
        border: 1,
        hintText: "last name",
        id: "acct_lname"
    });
    $.__views.cavContainer.add($.__views.acct_lname);
    $.__views.acct_email = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        borderColor: "gray",
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        top: "6dp",
        left: "4dp",
        bottom: "2dp",
        right: "4dp",
        paddingLeft: "4dp",
        backgroundColor: "white",
        color: "black",
        width: "260dp",
        height: "36dp",
        border: 1,
        hintText: "email address",
        id: "acct_email"
    });
    $.__views.cavContainer.add($.__views.acct_email);
    $.__views.acct_password = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        borderColor: "gray",
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        top: "6dp",
        left: "4dp",
        bottom: "2dp",
        right: "4dp",
        paddingLeft: "4dp",
        backgroundColor: "white",
        color: "black",
        width: "260dp",
        height: "36dp",
        border: 1,
        passwordMask: true,
        hintText: "password",
        id: "acct_password"
    });
    $.__views.cavContainer.add($.__views.acct_password);
    $.__views.acct_password_confirmation = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        borderColor: "gray",
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        top: "6dp",
        left: "4dp",
        bottom: "2dp",
        right: "4dp",
        paddingLeft: "4dp",
        backgroundColor: "white",
        color: "black",
        width: "260dp",
        height: "36dp",
        border: 1,
        passwordMask: true,
        hintText: "password confirmation",
        id: "acct_password_confirmation"
    });
    $.__views.cavContainer.add($.__views.acct_password_confirmation);
    $.__views.__alloyId2 = Ti.UI.createView({
        top: "10dp",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        layout: "horizontal",
        id: "__alloyId2"
    });
    $.__views.cavContainer.add($.__views.__alloyId2);
    $.__views.doCreateAcctBtn = Ti.UI.createButton({
        top: "6dp",
        width: "100dp",
        height: "36dp",
        font: {
            fontSize: "13dp"
        },
        border: 1,
        borderColor: "gray",
        left: "0dp",
        id: "doCreateAcctBtn",
        title: "Create Account"
    });
    $.__views.__alloyId2.add($.__views.doCreateAcctBtn);
    $.__views.cancelCreateAcctBtn = Ti.UI.createButton({
        top: "6dp",
        width: "100dp",
        height: "36dp",
        font: {
            fontSize: "13dp"
        },
        border: 1,
        borderColor: "gray",
        left: "10dp",
        id: "cancelCreateAcctBtn",
        title: "Cancel"
    });
    $.__views.__alloyId2.add($.__views.cancelCreateAcctBtn);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.parentController = args.parentController;
    $.doLoginBtn.addEventListener("click", doLoginBtnClicked);
    $.doFacebookLoginBtn.addEventListener("click", doFacebookLoginBtnClicked);
    $.doCreateAcctBtn.addEventListener("click", doCreateAcctBtnClicked);
    $.open = function() {
        $.index.open();
    };
    $.close = function() {
        $.index.close();
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;