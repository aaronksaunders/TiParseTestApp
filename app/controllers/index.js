require("ti.parse_mine")({
  facebookAppId : 'facebookAppId',
  applicationId : "applicationId",
  javascriptkey : "javascriptkey"
});

/**
 *
 */
$.loginSuccessAction = function(_options) {

  Ti.API.info('logged in user information');
  Ti.API.info(JSON.stringify(_options.model, null, 2));

  // pre-populate the feed with recent photos
  $.mainController.initialize();

  // get the current user
  Alloy.Globals.currentUser = _options.model;

  // do any necessary cleanup in login controller
  $.loginController && $.loginController.close();
};

/**
 * if the user is not logged in then create controller and display
 * login view for account creation or login effort
 */
function userIsNotLoggedIn() {

  // open the login controller to login the user
    $.loginController = Alloy.createController("login", {
      parentController : $,
      reset : true
    });

  // open the window
  $.loginController.open(true);

};

/**
 * 
 * @param {Object} _currentUser
 */
function userIsLoggedIn(_currentUser) {
  if (_currentUser) {

    // get the current user
    Alloy.Globals.currentUser = _currentUser;

    // do stuff with the user
    console.log(JSON.stringify(_currentUser, null, 2));

    debugger;
    var Farmers = Parse.Object.extend("farmers");
    var query = new Parse.Query(Farmers);
    query.find().then(function(farmers) {
      debugger;

    }, function(error) {
      // Everything is done!
      debugger;
    });
  }
};

// when we start up, create a user and log in
var currentUser = Parse.User.current();

// we are using the default administration account for now
//user.login("wileytigram_admin", "wileytigram_admin", function(_response) {
if (currentUser === true) {
  userIsLoggedIn(currentUser);
} else {
	console.log("userIsNotLoggedIn");
  userIsNotLoggedIn();
}
