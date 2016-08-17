/**
 * @ngdoc skeleApp
 * @name skeleApp
 * @description App Init.
*/

(function() {
  'use strict';

  //INITIATE MAIN APP
  angular.module('skeleApp', [
    'ui.router',
    'ngTouch',
    'ngMessages'
  ])

  // ROUTING
  .config(['$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('/', {
      url: '/',
      templateUrl: 'assets/views/login.html',
      controller: 'LoginController as login',
    });

  }])

  .run(function() {
    console.log('-- app initiated --');
  });

})();
