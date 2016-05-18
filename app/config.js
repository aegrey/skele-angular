/**
 * @ngdoc skeleApp
 * @name skeleApp.factory:Config
 * @description Configuration variables
*/

(function() {
  'use strict';

  angular.module('skeleApp')
  .factory('Config',
    [Config]);

  function Config() {
    return {
      apiUrl: 'https://api.domain.com/',
      authKey: 'Auth Key',
      authSecret: 'Auth Secret',
      appVersion: '0.0.1'
    };
  }
}());
