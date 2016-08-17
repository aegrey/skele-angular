/**
 * @ngdoc skeleApp
 * @name skeleApp.directive:UserFormDirective
 * @description User Form Directive
*/

(function() {
  'use strict';

  angular.module('skeleApp')
  .directive('userFormDirective', [
    '$templateCache',
    '$compile',
    UserFormDirective
  ]);

  function UserFormDirective($templateCache, $compile) {
  	return {
  		restrict: 'E',
      templateUrl: 'assets/views/user-form.html',
      scope: {
        formType: '@'
      },
  		require: "ngModel",
  		link: link
  	};

    function link(scope, elements, attrs, ngModelController) {

      function checkPassword() {

        if($scope.userObject.password === $scope.userObject.passwordConfirm) {
          //TODO: Process User
        } else {
          $scope.formErrors.push({'message': 'Passwords do not match'});
        }
      }
    }
  }

}());
