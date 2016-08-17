/**
 * @ngdoc skeleApp
 * @name skeleApp.controller:LoginController
 * @description Login Controller
*/

(function() {
  'use strict';

  angular.module('skeleApp')
  .controller('LoginController', [
    '$cookies',
    '$location',
    '$scope',
    '$window',
    'LoginService',
    LoginController
  ]);

  function LoginController($cookies, $location, $scope, $window, LoginService) {

    //---- Init Variables -----
    var login = this;
    login.loginAttempts = 0;

    //View scope vars
    $scope.userObject = {}; //ng-model for form
    $scope.formErrors = []; //ng-model for errors !TODO: Move this into a service
    $scope.formType = 'login'; //scope variable for directive

    console.log('--login initiated--');



    function checkUser() {
      //!TODO: set login attempt max
      return LoginService.checkUser($scope.userObject).then(function(response) {
        if(!response.error) {
          return response;
        } else {
          $scope.formErrors.push({'message': 'Login Failed. Please try again.'});
          login.loginAttempts++;
        }
      });
    }
  }

})();
