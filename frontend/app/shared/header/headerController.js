app.controller('HeaderController', function($scope, $rootScope, $window) {

    $scope.headerInit = function() {
        console.log("header init");
        $scope.currentPage = $rootScope.currentPage;
    }


    $window.fbAsyncInit = function() {
        FB.init({
            appId      : '1802079610118314', // Set YOUR APP ID
            status     : true, // check cadastroUsuario status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : true,  // parse XFBML
            version    : 'v2.3'
        });

        FB.Event.subscribe('auth.authResponseChange', function(response) {
            if (response.status === 'connected') {
                //SUCCESS
            }
            else if (response.status === 'not_authorized') {
                //FAILED
            }
            else {
                //UNKNOWN ERROR
            }
        });
    };

    $scope.login = function() {
        FB.login(function(response) {
            if (response.authResponse) {
                getUserInfo();
            }
            else {
                console.log('User cancelled cadastroUsuario or did not fully authorize.');
            }
        },{ scope: 'email, user_about_me, user_birthday, user_hometown' });
    }

    function getUserInfo() {
        FB.api('/me?fields=name,email,gender,birthday,link', function(response) {
            console.log(response);
            var str = "<b>Name</b> : " + response.name + "<br>";
            str += "<b>Link: </b>" + response.link + "<br>";
            str += "<b>Username:</b> " + response.username + "<br>";
            str += "<b>id: </b>" + response.id + "<br>";
            str += "<b>Email:</b> " + response.email + "<br>";
            str += "<input type='button' value='Get Photo' onclick='getPhoto();'/>";
            str += "<input type='button' value='Logout' onclick='Logout();'/>";
            document.getElementById("status").innerHTML = str;
        }, { scope: 'email, user_about_me, user_birthday, user_hometown' });
    }


    function getPhoto() {
        FB.api('/me/picture?type=normal', function(response) {
            var str="<br/><b>Pic</b> : <img src='"+response.data.url+"'/>";
            document.getElementById("status").innerHTML+=str;
        });
    }

    function Logout() {
        FB.logout(function(){document.location.reload();});
    }

    // Load the SDK asynchronously
    (function(d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }

        js      = d.createElement('script');
        js.id   = id; js.async = true;
        js.src  = "http://connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));
});