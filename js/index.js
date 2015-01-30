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




window.onload = function () {
    "use strict";

    getLocation();
    getTime();
};