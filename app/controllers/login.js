var args = arguments[0] || {};


$.doLoginBtn.addEventListener('click', doLoginBtnClicked);
$.doFacebookLoginBtn.addEventListener('click', doFacebookLoginBtnClicked);
$.doCreateAcctBtn.addEventListener('click', doCreateAcctBtnClicked);



/**
 * use the graph API to get basic information about the user
 * 
 * @param {Function} _callback function to call when request is completed
 */
function getFacebookInfo(_callback) {
  TiFacebook.requestWithGraphPath('me', {}, 'GET', function(e) {
    if (e.success) {
      var jsonObject = JSON.parse(e.result);
      console.log("getFacebookInfo " + e.result);
      _callback && _callback(jsonObject);
    } else {
      console.log(JSON.stringify(e));
      _callback && _callback({});
    }
  });

};

/**
 * when user logs in through facebook, be sure to add the additional account
 * information if it is the first time
 * 
 * @param {Object} _options data from FB login
 */
function doFacebookLoginBtnClicked(_options) {
  blurTextFields();

  Parse.FacebookUtils.logIn(null, {
    success : function(user) {
      if (!user.existed()) {
        alert("User signed up and logged in through Facebook!");

        // get more information on the user to add
        // to the user object
        getFacebookInfo(function(_userInformation) {
          // Do stuff after successful login.
          console.log(JSON.stringify(user));

          user.set('fb_username' , _userInformation.username);
          user.set('first_name' , _userInformation.first_name);
          user.set('last_name' , _userInformation.last_name);
          user.set('email' , _userInformation.email);

          //update the user object
          user.save().then(function(obj) {
            args.loginSuccess(user);
          }, function(error) {
            alert("Error updating user object " + error);
            args.loginSuccess(user);
          });

        });

      } else {
        alert("User logged in through Facebook!");
        getFacebookInfo();
        console.log(JSON.stringify(user));
        args.loginSuccess(user);
      }

    },
    error : function(user, error) {
      alert("User cancelled the Facebook login or did not fully authorize.");
    }
  });
}

/**
 * blurs all text fields so the keyboard goes away
 */
function blurTextFields() {
  // login view
  _.each($.lvContainer.children, function(_i) {
    _i.value !== undefined && _i.blur();
  });

  // account creation view
  _.each($.cavContainer.children, function(_i) {
    _i.value !== undefined && _i.blur();
  });

}

/**
 * take action when login button is clicked
 */
function doLoginBtnClicked() {

  blurTextFields();

  Parse.User.logIn($.email.value, $.password.value, {
    success : function(user) {
      // Do stuff after successful login.
      console.log(JSON.stringify(user));

      args.loginSuccess(user);
    },
    error : function(user, error) {
      // The login failed. Check error to see why.
      console.log(JSON.stringify(error));
      alert(error.message);
    }
  });
};

/**
 * take action when account creation is clicked
 */
function doCreateAcctBtnClicked() {

  blurTextFields();

  if ($.acct_password.value !== $.acct_password_confirmation.value) {
    alert("Please re-enter information");
    return;
  }

  var params = {
    first_name : $.acct_fname.value,
    last_name : $.acct_lname.value,
    username : $.acct_email.value,
    email : $.acct_email.value,
    password : $.acct_password.value,
  };
  var user = new Parse.User(params);

  user.signUp(null, {
    success : function(user) {
      // Hooray! Let them use the app now.
      console.log(JSON.stringify(user));

      args.loginSuccess(user);
    },
    error : function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
  });
};

$.open = function(_reset) {
  $.index.open();
};
$.close = function() {
  $.index.close();
};
