function redirect_init() {
    var extractToken = function(hash) {
        var match = hash.match(/access_token=(\w+)/);
        return !!match && match[1];
    };
    
    var token = extractToken(document.location.hash);
    
    if (token) {
        localStorage.setItem("token", token);

        callback = localStorage.getItem("callback_function");
        var fn = window.opener[callback];
        
        if (typeof fn === "function") {
            fn();
        }
    } else {
        console.log('error: token not found');
    }
    
    window.close();
}