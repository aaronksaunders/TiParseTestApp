var args = arguments[0] || {};
$.parentController = args.parentController;


//$.cancelCreateAcctBtn.addEventListener('click', cancelActionButtonClicked);
//$.cancelLoginBtn.addEventListener('click', cancelActionButtonClicked);

$.doLoginBtn.addEventListener('click', doLoginBtnClicked);
$.doFacebookLoginBtn.addEventListener('click', doFacebookLoginBtnClicked);
$.doCreateAcctBtn.addEventListener('click', doCreateAcctBtnClicked);



function cancelActionButtonClicked() {
  $.createAcctView.hide();
  $.loginView.hide();

  // set the global login state to false
  Alloy.Globals.loggedIn = false;

  // display only the home state view
  $.homeView.show();
}



/**
 *
 * @param {Object} _options data from FB login
 */
function doFacebookLoginBtnClicked(_options) {

}

function doLoginBtnClicked() {

};

function doCreateAcctBtnClicked() {
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
    password_confirmation : $.acct_password_confirmation.value,
  };

};

$.open = function(_reset) {
  $.index.open();
};
$.close = function() {
  $.index.close();
};
