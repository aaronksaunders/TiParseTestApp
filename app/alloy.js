// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
function isIOS7Plus()
{
  // iOS-specific test
  if (Titanium.Platform.name == 'iPhone OS')
  {
    var version = Titanium.Platform.version.split(".");
    var major = parseInt(version[0],10);

    // Can only test this support on a 3.2+ device
    if (major >= 7)
    {
      return true;
    }
  }
  return false;
}

Alloy.Globals.iOS7 = isIOS7Plus();
Alloy.Globals.theTop = (Alloy.Globals.iOS7 ? 20 : 0) + 'dp';
Alloy.Globals.isAndroid = Ti.Platform.osname === 'android';