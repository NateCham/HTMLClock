function getTime() {
    "use strict";
    
    var d = new Date();
    document.getElementById("time").innerHTML = d.toLocaleTimeString();
    
    window.setTimeout(getTime, 1000);
}

window.onload = function () {
    "use strict";
    
    getTime();
};