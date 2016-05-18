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
    'ngCookies',
    'ngTouch',
    'ngAnimate',
    'ngMessages'
  ])

  // ROUTING
  .config(['$stateProvider',
    '$urlRouterProvider',
    '$templateCache',
    function($stateProvider, $urlRouterProvider, $templateCache) {

    $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'landing/index.html',
      controller: 'LandingController as landing',

    })
    .state('login', {
      url: '/login',
      templateUrl: 'user/login.html',
      controller: 'LoginController as login',
    })

    $urlRouterProvider.otherwise('/');
  }]);

})();
