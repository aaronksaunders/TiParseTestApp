function isIOS7Plus() {
    var version = Titanium.Platform.version.split(".");
    var major = parseInt(version[0], 10);
    if (major >= 7) return true;
    return false;
}

var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.iOS7 = isIOS7Plus();

Alloy.Globals.theTop = (Alloy.Globals.iOS7 ? 20 : 0) + "dp";

Alloy.Globals.isAndroid = "android" === Ti.Platform.osname;

Alloy.createController("index");