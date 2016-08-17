/**
 * @ngdoc skeleApp
 * @name skeleApp.factory:LoginService
 * @description Login Service
*/

(function() {
  'use strict';

  angular.module('skeleApp')
  .factory('LoginService', [
    'Config',
    '$http',
    LoginService
  ]);

  function LoginService(Config, $http) {
    return {
      checkUser: function(userObject) {
        var conn = $http({
          method: 'POST',
          url: Config.apiUrl,
          data: {
            authKey:    Config.authKey,
            authSecret: Config.authSecret,
            username:   userObject.username,
            password:   userObject.password
          }
        })
        .then(successCallback, errorCallback);

        function successCallback(response) {
          return response;
        }

        function errorCallback(message, status, headers) {
          var error = {
            error: true,
            message: message,
            status: status,
            headers: headers
          };
          return error;
        }

        return conn;
      }
    };
  }

}());
