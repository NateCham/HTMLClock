function init(oauth) {
    localStorage.setItem("client_id", oauth.client_id);
    localStorage.setItem("type", oauth.type);
    localStorage.setItem("callback_function", oauth.callback_function);
}

function login() {
    client_id = localStorage.getItem("client_id");
    type = localStorage.getItem("type");
        
    window.open('https://api.imgur.com/oauth2/authorize?client_id=' + client_id + '&response_type=' + type);
}