function getTemp(latitude, longitude) {
    "use strict";
    
    var coords = latitude + "," + longitude;
    
    var api_key = "b763d6064a69b377bf7febb7347c5045";
    var url = "https://api.forecast.io/forecast/" + api_key + "/" + coords + "?callback=?";
    
    $.getJSON(url, function (data) {
        $('#forecastLabel').html(data.currently.summary);
        $('#forecastIcon').attr('src', 'img/' + data.currently.icon + '.svg');
        
        var max_temp = data.daily.data[0].temperatureMax;
        
        $('body').addClass(getTempClass(max_temp));
    });  
}

function geoSuccess(position) {
    "use strict";
    
    var latitude = position.coords.latitude, longitude = position.coords.longitude;
    
    getCity(latitude, longitude);
    
    getTemp(latitude, longitude);
}

function geoError() {
    "use strict";
    
    $('#geolocation').html('Geolocation is not available. Coordinates default to Cal Poly CSC building.');
    
    var latitude = "35.300399";
    var longitude = "-120.662362";
    
    getTemp(latitude, longitude);
}


function getLocation() {
    "use strict";
    
    geoError();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess);
    } else {
        geoError();
    }
}

function getCity(latitude, longitude) {
    var api_key = "AIzaSyAh0_XsvKqahyevffHgr-dq0znDdYBDUUU"
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&result_type=locality&key=" + api_key;
    
    $.getJSON(url, function (data) {
        $('#name').html('Weather Clock for ' + data.results[0].formatted_address);
    });
}

function getTime() {
    "use strict";
    
    var d = new Date();
    document.getElementById("time").innerHTML = d.toLocaleTimeString();
    
    window.setTimeout(getTime, 1000);
}


function getTempClass(max_temp) {
    "use strict";
            
    switch (true) {
        case (max_temp >= 90):
            return 'hot';
        case (max_temp >= 80):
            return 'warm';
        case (max_temp >= 70):
            return 'nice';
        case (max_temp >= 60):
            return 'chilly';
        default:
            return 'cold';
    }
}

function showAlarmPopup() {
    $('#mask').removeClass("hide");
    $('#popup').removeClass("hide");
}

function hideAlarmPopup() {
    $('#mask').addClass('hide');
    $('#popup').addClass('hide');
}

function insertAlarm(time, alarmName) {
    var divOut = $("<div id=" + alarmName + "></div>");
    divOut.addClass("flexible");
    
    var nameDiv = $("<div></div>");
    nameDiv.addClass('name');
    nameDiv.html(alarmName + " -- ");
    
    var timeDiv = $("<div></div>")
    timeDiv.addClass('time');
    timeDiv.html(time.hours + ':' + time.mins + time.ampm);
    
    var deleteButton = $('<input type="button" value="Delete" onclick="deleteAlarm(\'' + alarmName + '\')" />');
    
    divOut.append(nameDiv);
    divOut.append(timeDiv);
    divOut.append(deleteButton);
    
    $("#alarms").append(divOut);
    
}

function addAlarm() {
    
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            ga('send', 'event', 'Alarm', 'Add');
            
            var hours, mins, ampm, alarmName;
    
            hours = $("#hours option:selected").text();
            mins = $("#minutes option:selected").text();
            ampm = $("#ampm option:selected").text();
            alarmName = $("#alarmName").val();

            time = {
                "hours": hours,
                "mins": mins,
                "ampm": ampm
            };

            var AlarmObject = Parse.Object.extend("Alarm");
            var alarmObject = new AlarmObject();
            alarmObject.save(
                {"time": time,
                 "alarmName": alarmName,
                 "userId": response.authResponse.userID
                },
                {
                    success: function(object) {
                        insertAlarm(time, alarmName);
                        hideAlarmPopup();
                    }
            });
        }
    });
    
}

function deleteAlarm(alarmName) {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            ga('send', 'event', 'Alarm', 'Delete');

            var AlarmObject = Parse.Object.extend("Alarm");
            var query = new Parse.Query(AlarmObject);
            query.equalTo("alarmName", alarmName);
            query.equalTo("userId", response.authResponse.userID);
            query.first({
                success: function(alarmObj) {
                    alarmObj.destroy({
                        success: function(Obj) {
                            $('#' + alarmName).remove();
                        }
                    });
                }
            });
        }
    });
}

function getAlarms(userid) {
    Parse.initialize("XB4tEWWbsMaAb73mHlyxQXqVbU3jMNuf6HNAO8VB", "81MeiKhYfNDJBWIbtbKsVV3Rwl8Jo0MIQmSCCjaP");
    
    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.equalTo("userId", userid);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
                insertAlarm(results[i].get("time"), results[i].get("alarmName"));
            }
        }
    });
}


function facebookLogin() {
  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      getAlarms(response.authResponse.userID);
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '516757385128970',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }    
}

function callback() {
    token = localStorage.getItem("token");

    $.ajax({
        url: 'https://api.imgur.com/3/account/me',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function(result) {
            alert('Imgur User Name: ' + result.data.url);
            console.log(result);
        }
    });
}

function onload() {
    "use strict";
    getLocation();
    getTime();
    //facebookLogin();
    
    var oauth_params = {'client_id' : '0383d9edf04aa3c',
                    'type' : 'token',
                    'callback_function' : 'callback'};
    init(oauth_params);
}