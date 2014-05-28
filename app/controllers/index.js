require('ti.parse_mine')({
  facebookAppId : '',
  applicationId : '',
  javascriptkey : ''
});

/**
 * click logout, logout of parse
 */
if (OS_IOS) {
  $.logoutBtn.addEventListener('click', function() {
    Parse.User.logOut();

    console.log('User Just Logged Out');
    userIsNotLoggedIn();
  });

  /**
   * click camera, take picture */
  $.cameraButton.addEventListener('click', function() {
    processCameraClick();
  });
}

/**
 * on successful login, display user information
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
 *
 */
function processCamerClick() {
  require('cameraService').getPhoto().then(function(_response) {
    return require('photoService').savePhoto({
      media : _response.media
    });
  }).then(function(_saveResult) {
    Ti.API.debug(JSON.stringify(_saveResult, null, 2));

    // update list view
    loadSomeData();
  }, function(_error) {
    alert(_error.msg);
  });
}

/**
 * if the user is not logged in then create controller and display
 * login view for account creation or login effort
 */
function userIsNotLoggedIn() {

  // open the login controller to login the user
  $.loginController = Alloy.createController('login', {
    parentController : $,
    reset : true,
    loginSuccess : function(_user) {
      userIsLoggedIn(_user);

      // close login window/controller
      setTimeout(function() {
        $.loginController.close();
      }, 300);
    }
  });

  // open the window
  $.loginController.open(true);

};

/**
 * if user is logged in, then display the account information
 *
 * @param {Object} _currentUser
 */
function userIsLoggedIn(_currentUser) {

  // open index if not open already
  if ($.indexIsNotOpened) {
    $.getView().open();
    $.indexIsNotOpened = false;
  }

  if (_currentUser && false) {

    // get the current user
    Alloy.Globals.currentUser = _currentUser;

    // do stuff with the user
    console.log(JSON.stringify(_currentUser, null, 2));
    $.fb_un.text = _currentUser.get('fb_username') || 'No Value: FB username';
    $.un.text = _currentUser.get('username');
    $.fn.text = _currentUser.get('first_name') || 'No Value: first name';
    $.ln.text = _currentUser.get('last_name') || 'No Value: last name';
    $.email.text = _currentUser.get('email') || 'No Value: email';
    $.phone.text = _currentUser.get('phone') || 'No Value: phone number';
    $.isFB.text = _currentUser.get('authData') ? 'Facebook' : 'Not Facebook';
  }

  // get the data
  loadSomeData();
};
function loadMoreBtnClicked(_event) {
  alert('not implemented yet');
}

function loadSomeData() {
  var testObjects = Parse.Object.extend('TestObject');
  var query = new Parse.Query(testObjects);
  query.find({
    success : function(results) {
      alert('Successfully retrieved ' + results.length + ' testObjects.');
      debugger;
      createListView(results);
    },
    error : function(error) {
      alert('Error: ' + error.code + ' ' + error.message);
    }
  });
}

function createListView(_data) {

  // clear the list
  $.section.deleteItemsAt(0, $.section.items.length);

  // this is pretty straight forward, assigning the values to the specific
  // properties in the template we defined above
  var items = [];
  for (var i in _data) {

    // add items to an array
    items.push({
      template : 'template1', // set the template
      textLabel : {
        text : _data[i].get('foo') || 'Missing'// assign the values from the data
      },
      pic : {
        image : _data[i].get('aFile').url() // assign the values from the data
      }
    });
  }

  // add the array, items, to the section defined in the view.xml file
  $.section.setItems(items);

}

function doOpen() {
  if (OS_ANDROID) {
    var activity = $.getView().activity;
    var actionBar = activity.actionBar;

    activity.onCreateOptionsMenu = function(_event) {

      if (actionBar) {
        actionBar.displayHomeAsUp = true;
        actionBar.title = 'Parse Test App';
        actionBar.onHomeIconItemSelected = function() {
          $.getView().close();
        };
      } else {
        alert('No Action Bar Found');
      }

      // add the button/menu to the titlebar
      menuItem = _event.menu.add({
        //itemId : 'PHOTO',
        title : 'Take Photo',
        showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
        icon : Ti.Android.R.drawable.ic_menu_camera
      });

      menuItem.addEventListener('click', function(e) {
        processCamerClick();
      });
    };
  }
};

// when we start up, create a user and log in
var currentUser = Parse.User.current();

$.indexContainer.top = (Alloy.Globals.iOS7 ? 40 : 0) + 'dp';
$.indexIsNotOpened = true;

// we are using the default administration account for now
// user.login('wileytigram_admin', 'wileytigram_admin', function(_response) {
if (currentUser) {
  userIsLoggedIn(currentUser);

} else {
  console.log('userIsNotLoggedIn');
  userIsNotLoggedIn();
}
