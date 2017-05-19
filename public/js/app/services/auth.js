angular.module('App.services.Auth', [])
.factory('AuthService', function ($http) {
  var authService = {};
 
  authService.login = function (credentials) {
    if(credentials.username === "johndoe" && credentials.password==="123456"){
      sessionStorage.setItem("logged", true);
      return true;
    } else {
      return false;
    }
  };
 
  authService.isLoggedIn = function () {
    var logged = sessionStorage.getItem("logged");
    return (logged !== undefined && logged !== null && logged)?
      true : false;
  };

  authService.logout = function () {
    sessionStorage.removeItem("logged");
  }

  authService.registerUser = function (data) {
    return $http.post("/api/user/register", data);
  };

  return authService;
});